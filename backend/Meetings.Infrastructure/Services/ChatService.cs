using AutoMapper;
using Meetings.Authentication.Services;
using Meetings.Database.QueryExtensions;
using Meetings.Database.Repositories;
using Meetings.FileManager;
using Meetings.Infrastructure.Helpers;
using Meetings.Infrastructure.Hubs;
using Meetings.Infrastructure.Mappers;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Meetings.Models.Resources.Pagination;
using Meetings.Utilities.Extensions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Meetings.Infrastructure.Services
{
    public class ChatService
    {
        private readonly IRepository<Chat> _repository;
        private readonly IMapper _mapper;
        private readonly IClaimsReader _claimsReader;
        private readonly IHubContext<ChatHub, IChatHub> _chatHubContext;
        private readonly ExtendedMapper _extendedMapper;
        private readonly IFileManager _fileManager;
        private readonly ChatValidator _chatValidator;
        private readonly UserService _userService;
        private readonly MessageService _messageService;
        private readonly IServices _services;

        public ChatService(IRepository<Chat> repository,
                           IMapper mapper,
                           IClaimsReader claimsReader,
                           IHubContext<ChatHub, IChatHub> chatHubContext,
                           ExtendedMapper extendedMapper,
                           IFileManager fileManager,
                           ChatValidator chatValidator,
                           UserService userService,
                           MessageService messageService,
                           IServices services)
        {
            _repository = repository;
            _mapper = mapper;
            _claimsReader = claimsReader;
            _chatHubContext = chatHubContext;
            _extendedMapper = extendedMapper;
            _fileManager = fileManager;
            _chatValidator = chatValidator;
            _userService = userService;
            _messageService = messageService;
            _services = services;
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

            await _services.ChatParticipant.MarkChatAsRead(queryResult.Id);

            return new ChatDTO()
            {
                Id = queryResult.Id,
                Name = queryResult.Name,
                Type = queryResult.Type,
                TotalMessagesAmount = queryResult.TotalMessagesAmount,
                Participants = _extendedMapper.ToUserDTOList(queryResult.Participants)
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

        public async Task<PaginatedData<ChatPreview>> GetCurrentUserChats(GetCurrentUserChatsData data)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            List<Chat> queryResult = await _repository.Data
                .IncludeParticipants()
                .IncludeLastMessageWithAuthor()
                .Where(x => x.Participants.Select(x => x.UserId).Contains(userId))
                .If(data.Type == UserChatType.Private, q => q.Where(x => x.Type == ChatType.Private))
                .If(data.Type == UserChatType.Group, q => q.Where(x => x.Type == ChatType.Group))
                .ToListAsync();

            List<ChatPreview> result = new List<ChatPreview>();
            foreach (Chat x in queryResult)
            {
                ChatParticipant currentUserParticipant = x.Participants.Single(x => x.UserId == userId);
                if (data.Type == UserChatType.Ignored && !currentUserParticipant.IsIgnored) continue;
                if (data.Type == UserChatType.Archived && !currentUserParticipant.IsArchived) continue;
                if ((data.Type == UserChatType.Private || data.Type == UserChatType.Group) && (currentUserParticipant.IsArchived || currentUserParticipant.IsIgnored)) continue;

                Message lastMessage = x.Messages.Single();
                result.Add(new ChatPreview()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Type = x.Type,
                    HasUnreadMessages = currentUserParticipant.HasUnreadMessages,
                    LastMessage = _extendedMapper.ToMessageDTO(lastMessage),
                    LastMessageAuthor = _extendedMapper.ToUserDTO(lastMessage.Author),
                    Participants = _extendedMapper.ToUserDTOList(x.Participants.Select(x => x.User)),
                });
            }
            result = result.OrderByDescending(x => x.LastMessage?.CreatedAt).ToList();

            return new PaginatedData<ChatPreview>()
            {
                Data = result.Skip(data.Skip).Take(data.Take),
                TotalCount = result.Count
            };
        }
    }
}
