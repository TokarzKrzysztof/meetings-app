using AutoMapper;
using Meetings.Authentication.Services;
using Meetings.Database.QueryExtensions;
using Meetings.Database.Repositories;
using Meetings.FileManager;
using Meetings.Infrastructure.Hubs;
using Meetings.Infrastructure.Mappers;
using Meetings.Infrastructure.Utils;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Meetings.Utilities.Extensions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static System.Net.Mime.MediaTypeNames;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Meetings.Infrastructure.Services
{
    public class ChatService
    {
        private readonly IRepository<Chat> _repository;
        private readonly IRepository<ChatParticipant> _chatParticipantRepository;
        private readonly IMapper _mapper;
        private readonly IClaimsReader _claimsReader;
        private readonly IHubContext<ChatHub, IChatHub> _chatHubContext;
        private readonly ExtendedMapper _extendedMapper;
        private readonly IFileManager _fileManager;
        private readonly ChatValidator _chatValidator;
        private readonly UserService _userService;
        private readonly MessageService _messageService;

        public ChatService(IRepository<Chat> repository,
                           IMapper mapper,
                           IClaimsReader claimsReader,
                           IHubContext<ChatHub, IChatHub> chatHubContext,
                           IRepository<ChatParticipant> chatParticipantRepository,
                           ExtendedMapper extendedMapper,
                           IFileManager fileManager,
                           ChatValidator chatValidator,
                           UserService userService,
                           MessageService messageService)
        {
            _repository = repository;
            _mapper = mapper;
            _claimsReader = claimsReader;
            _chatHubContext = chatHubContext;
            _chatParticipantRepository = chatParticipantRepository;
            _extendedMapper = extendedMapper;
            _fileManager = fileManager;
            _chatValidator = chatValidator;
            _userService = userService;
            _messageService = messageService;
        }

        public async Task<ChatDTO?> GetPrivateChat(Guid participantId)
        {
            return await GetChat(ChatType.Private, participantId: participantId);
        }

        public async Task<ChatDTO> GetGroupChat(Guid chatId)
        {
            await _chatValidator.WhenGetGroupChat(chatId);
            return await GetChat(ChatType.Group, chatId: chatId);
        }

        private async Task<ChatDTO?> GetChat(ChatType type, Guid chatId = default, Guid participantId = default)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            var queryResult = await _repository.Data
                .If(type == ChatType.Private, q => q.GetPrivateByParticipants(userId, participantId))
                .If(type == ChatType.Group, q => q.Where(x => x.Id == chatId))
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Type,
                    TotalMessagesAmount = x.Messages.Count(),
                    Participants = x.Participants.Select(x => x.User)
                })
                .SingleOrDefaultAsync();

            if (queryResult == null) return null;

            await MarkChatAsRead(queryResult.Id);

            return new ChatDTO()
            {
                Id = queryResult.Id,
                Name = queryResult.Name,
                Type = queryResult.Type,
                TotalMessagesAmount = queryResult.TotalMessagesAmount,
                Participants = _extendedMapper.ToUserDTOList(queryResult.Participants)
            };
        }

        public async Task<IEnumerable<ChatPreview>> GetCurrentUserActiveChatsOfType(ChatType type)
        {
            IEnumerable<ChatPreview> chats = await GetCurrentUserChats(type);
            return chats.Where(x => !x.IsIgnored && !x.IsArchived);
        }

        public async Task<IEnumerable<ChatPreview>> GetCurrentUserIgnoredChats()
        {
            IEnumerable<ChatPreview> chats = await GetCurrentUserChats();
            return chats.Where(x => x.IsIgnored);
        }

        public async Task<IEnumerable<ChatPreview>> GetCurrentUserArchivedChats()
        {
            IEnumerable<ChatPreview> chats = await GetCurrentUserChats();
            return chats.Where(x => x.IsArchived);
        }

        public async Task<UnreadChatsCountData> GetUnreadChatsCount()
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            var unread = await _chatParticipantRepository.Data
                .Where(x => x.UserId == userId && x.HasUnreadMessages && !x.IsIgnored)
                .Select(x => x.Chat.Type).ToListAsync();
            return new UnreadChatsCountData()
            {
                Private = unread.Where(type => type == ChatType.Private).Count(),
                Group = unread.Where(type => type == ChatType.Group).Count(),
            };
        }

        public async Task<ChatDTO> CreatePrivateChat(CreatePrivateChatData data)
        {
            await _chatValidator.WhenCreatePrivateChat(data);

            await CreateNewChat(data.ConnectionId, MakeChatParticipants([data.ParticipantId]), ChatType.Private);
            return await GetPrivateChat(data.ParticipantId);
        }

        public async Task<Guid> CreateGroupChat(CreateGroupChatData data)
        {
            Guid chatId = await CreateNewChat(data.ConnectionId, MakeChatParticipants(data.UserIds), ChatType.Group, data.Name);

            string genderTxt = _claimsReader.GetCurrentUserGender() == UserGender.Male ? "utworzył" : "utworzyła";
            string info = $"{_claimsReader.GetCurrentUserFirstName()} {genderTxt} grupę.";
            await _messageService.SendInfoMessage(chatId, info);

            return chatId;
        }

        public async Task ChangeGroupChatName(ChangeGroupChatNameData data)
        {
            await _chatValidator.WhenChangeGroupChatName(data);

            Guid userId = _claimsReader.GetCurrentUserId();
            var chat = await _repository.Data.SingleAsync(x => x.Id == data.ChatId);

            chat.Name = data.Name;

            await _repository.Data.Where(x => x.Id == data.ChatId)
               .ExecuteUpdateAsync(s =>
                   s.SetProperty(x => x.Name, data.Name)
                );

            string genderTxt = _claimsReader.GetCurrentUserGender() == UserGender.Male ? "zmienił" : "zmieniła";
            string info = $"{_claimsReader.GetCurrentUserFirstName()} {genderTxt} nazwę grupy na {chat.Name}.";
            await _messageService.SendInfoMessage(data.ChatId, info);
        }

        public async Task AddGroupChatParticipant(Guid chatId, Guid userId)
        {
            await _chatValidator.WhenAddGroupChatParticipant(chatId, userId);

            await _chatParticipantRepository.Create(new ChatParticipant(userId, chatId));

            var user = await _userService.GetUser(userId);
            string genderTxt = _claimsReader.GetCurrentUserGender() == UserGender.Male ? "dodał" : "dodała";
            string info = $"{_claimsReader.GetCurrentUserFirstName()} {genderTxt} użytkownika {user.FirstName + " " + user.LastName} do grupy.";
            await _messageService.SendInfoMessage(chatId, info);
        }

        public async Task RemoveGroupChatParticipant(Guid chatId, Guid userId, bool isFromLeaveChat = false)
        {
            await _chatValidator.WhenRemoveGroupChatParticipant(chatId, userId);

            ChatParticipant item = await _chatParticipantRepository.Data.SingleAsync(x => x.ChatId == chatId && x.UserId == userId);
            await _chatParticipantRepository.RemovePermanently(item);

            if (isFromLeaveChat)
            {
                string genderTxt = _claimsReader.GetCurrentUserGender() == UserGender.Male ? "opuścił" : "opuściła";
                string info = $"{_claimsReader.GetCurrentUserFirstName()} {genderTxt} grupę.";
                await _messageService.SendInfoMessage(chatId, info);
            }
            else
            {
                var user = await _userService.GetUser(userId);
                string genderTxt = _claimsReader.GetCurrentUserGender() == UserGender.Male ? "usunął" : "usunęła";
                string info = $"{_claimsReader.GetCurrentUserFirstName()} {genderTxt} użytkownika {user.FirstName + " " + user.LastName} z grupy.";
                await _messageService.SendInfoMessage(chatId, info);
            }
        }

        public async Task LeaveGroupChat(Guid chatId)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            await RemoveGroupChatParticipant(chatId, userId, true);
        }

        public async Task MarkChatAsRead(Guid chatId)
        {
            await GetCurrentUserParticipantQuery(chatId)
                .ExecuteUpdateAsync(s =>
                    s.SetProperty(x => x.HasUnreadMessages, false)
                 );
        }

        public async Task ToggleIgnoreChat(Guid chatId)
        {
            await GetCurrentUserParticipantQuery(chatId)
               .ExecuteUpdateAsync(s =>
                   s.SetProperty(x => x.IsIgnored, x => !x.IsIgnored)
                );
        }

        public async Task ToggleArchiveChat(Guid chatId)
        {
            await GetCurrentUserParticipantQuery(chatId)
                .ExecuteUpdateAsync(s =>
                    s.SetProperty(x => x.IsArchived, x => !x.IsArchived)
                 );
        }

        private IQueryable<ChatParticipant> GetCurrentUserParticipantQuery(Guid chatId)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            return _chatParticipantRepository.Data.Where(x => x.UserId == userId && x.ChatId == chatId);
        }

        private async Task<Guid> CreateNewChat(string connectionId, List<ChatParticipant> participants, ChatType type, string name = null)
        {
            var createdChat = await _repository.Create(new Chat()
            {
                Participants = participants,
                Name = name,
                Type = type
            });

            await _chatHubContext.Groups.AddToGroupAsync(connectionId, createdChat.Id.ToString());

            return createdChat.Id;
        }

        private List<ChatParticipant> MakeChatParticipants(IEnumerable<Guid> userIds, Guid? chatId = null)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            Guid[] ids = [userId, .. userIds];
            return ids.Select(x => new ChatParticipant(x, chatId ?? Guid.Empty)).DistinctBy(x => x.UserId).ToList();
        }

        private async Task<IEnumerable<ChatPreview>> GetCurrentUserChats(ChatType? type = null)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            List<Chat> chats = await _repository.Data
                .IncludeParticipants()
                .IncludeLastMessageWithAuthor()
                .Where(x => x.Participants.Select(x => x.UserId).Contains(userId))
                .If(type != null, q => q.Where(x => x.Type == type))
                .ToListAsync();

            return chats.Select(x =>
            {
                ChatParticipant currentUserParticipant = x.Participants.Single(x => x.UserId == userId);
                Message lastMessage = x.Messages.Single();
                return new ChatPreview()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Type = x.Type,
                    HasUnreadMessages = currentUserParticipant.HasUnreadMessages,
                    LastMessage = _extendedMapper.ToMessageDTO(lastMessage),
                    LastMessageAuthor = _extendedMapper.ToUserDTO(lastMessage.Author),
                    Participants = _extendedMapper.ToUserDTOList(x.Participants.Select(x => x.User)),
                    IsIgnored = currentUserParticipant.IsIgnored,
                    IsArchived = currentUserParticipant.IsArchived,
                };
            }).OrderByDescending(x => x.LastMessage?.CreatedAt);
        }
    }
}
