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
using Meetings.Utils.Extensions;
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
        private readonly IRepository<Message> _messageRepository;
        private readonly IRepository<MessageReaction> _messageReactionRepository;
        private readonly IRepository<ChatParticipant> _chatParticipantRepository;
        private readonly IMapper _mapper;
        private readonly IClaimsReader _claimsReader;
        private readonly IHubContext<ChatHub, IChatHub> _chatHubContext;
        private readonly ExtendedMapper _extendedMapper;
        private readonly IFileManager _fileManager;
        private readonly ChatValidator _chatValidator;

        public ChatService(IRepository<Chat> repository,
                           IMapper mapper,
                           IClaimsReader claimsReader,
                           IRepository<Message> messageRepository,
                           IHubContext<ChatHub, IChatHub> chatHubContext,
                           IRepository<ChatParticipant> chatParticipantRepository,
                           ExtendedMapper extendedMapper,
                           IFileManager fileManager,
                           IRepository<MessageReaction> messageReactionRepository,
                           ChatValidator chatValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _claimsReader = claimsReader;
            _messageRepository = messageRepository;
            _chatHubContext = chatHubContext;
            _chatParticipantRepository = chatParticipantRepository;
            _extendedMapper = extendedMapper;
            _fileManager = fileManager;
            _messageReactionRepository = messageReactionRepository;
            _chatValidator = chatValidator;
        }

        public async Task<ChatDTO?> GetPrivateChat(Guid participantId)
        {
            return await GetChat(ChatType.Private, participantId: participantId);
        }

        public async Task<ChatDTO> GetGroupChat(Guid chatId)
        {
            var chat = await GetChat(ChatType.Group, chatId: chatId);
            _chatValidator.AfterGetGroupChat(chat);

            return chat;
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

        public async Task<List<MessageDTO>> LoadChatMessages(Guid chatId, int skip, int take)
        {
            var messages = await _repository.Data.Where(x => x.Id == chatId)
                .IncludeAllMessagesData()
                .Select(x => x.Messages.OrderByDescending(x => x.CreatedAt).Skip(skip).Take(take).Reverse())
                .SingleAsync();

            return _extendedMapper.ToMessageDTOList(messages);
        }

        public async Task<List<MessageDTO>> LoadAllMessagesAfterDate(Guid chatId, DateTime afterDate)
        {
            var messages = await _repository.Data.Where(x => x.Id == chatId)
                 .IncludeAllMessagesData()
                 .Select(x => x.Messages.OrderByDescending(x => x.CreatedAt).Where(x => x.CreatedAt >= afterDate).Reverse())
                 .SingleAsync();

            return _extendedMapper.ToMessageDTOList(messages);
        }

        private async Task<Message> CreateMessage(Guid authorId, Guid chatId, SendMessageData data)
        {
            if (data.ReplyToId != null)
            {
                var replyTo = await _messageRepository.GetById((Guid)data.ReplyToId);
                if (replyTo.ChatId != chatId)
                {
                    // TODO move to validator class
                    throw new Exception();
                }
            }

            if (data.Type == MessageType.Text)
            {
                return await _messageRepository.Create(new Message()
                {
                    Id = data.Id,
                    AuthorId = authorId,
                    ChatId = chatId,
                    ReplyToId = data.ReplyToId,
                    Value = data.Value!.Trim(),
                    Type = MessageType.Text,
                });
            }

            string extension = data.Type == MessageType.Image ? "jpg" : "mp3";
            var filePath = Path.Combine(_fileManager.Root, "Chats", chatId.ToString(), $"{Guid.NewGuid()}.{extension}");
            await _fileManager.Save(filePath, data.File!);

            return await _messageRepository.Create(new Message()
            {
                Id = data.Id,
                AuthorId = authorId,
                ChatId = chatId,
                ReplyToId = data.ReplyToId,
                Value = filePath,
                Type = data.Type,
            });
        }

        public async Task<MessageDTO> SendMessage(SendMessageData data)
        {
            await _chatValidator.WhenSendMessage(data);

            Guid authorId = _claimsReader.GetCurrentUserId();

            Message entity = await CreateMessage(authorId, data.ChatId, data);
            // refetch entity with required dependencies
            entity = await _messageRepository.GetById(entity.Id, q => q.IncludeAuthors());

            await UpdateParticipantsData(data.ChatId, authorId);

            return _extendedMapper.ToMessageDTO(entity);
        }

        public async Task<MessageDTO> SetMessageReaction(MessageReactionDTO data)
        {
            Message message = await _messageRepository.Data.Where(x => x.Id == data.MessageId).IncludeAuthors().Include(x => x.Reactions).SingleAsync();
            MessageReaction? authorReaction = message.Reactions.SingleOrDefault(x => x.AuthorId == data.AuthorId);
            if (authorReaction != null)
            {
                if (authorReaction.Unified == data.Unified)
                {
                    message.Reactions.Remove(authorReaction);
                }
                else
                {
                    authorReaction.Unified = data.Unified;
                }
            }
            else
            {
                message.Reactions.Add(_mapper.Map<MessageReaction>(data));
            }
            await _messageReactionRepository.UpdateRange(message.Reactions);

            return _extendedMapper.ToMessageDTO(message);
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
            Guid userId = _claimsReader.GetCurrentUserId();
            if (await _repository.Data.GetPrivateByParticipants(data.ParticipantId, userId).AnyAsync())
            {
                // TODO move to validator class
                throw new Exception();
            }

            await CreateNewChat(data.ConnectionId, MakeChatParticipants([data.ParticipantId]), ChatType.Private);
            return await GetPrivateChat(data.ParticipantId);
        }

        public async Task<Guid> CreateGroupChat(CreateGroupChatData data)
        {
            Guid chatId = await CreateNewChat(data.ConnectionId, MakeChatParticipants(data.UserIds), ChatType.Group, data.Name);
            return chatId;
        }

        public async Task EditGroupChat(EditGroupChatData data)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            var chat = await _repository.Data.Include(x => x.Participants).SingleAsync(x => x.Id == data.Id);
            chat.Name = data.Name;
            await _repository.Update(chat);

            await _chatParticipantRepository.SwapRange(chat.Participants, MakeChatParticipants(data.UserIds, chat.Id), x => x.UserId);
        }

        public async Task LeaveGroupChat(Guid chatId)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            var toRemove = await _chatParticipantRepository.Data.SingleAsync(x => x.UserId == userId && x.ChatId == chatId);

            await _chatParticipantRepository.RemovePermanently(toRemove);
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

        private async Task UpdateParticipantsData(Guid chatId, Guid authorId)
        {
            List<ChatParticipant> participants = await _chatParticipantRepository.Data.Where(x => x.ChatId == chatId).ToListAsync();
            participants.ForEach(x =>
            {
                if (x.UserId != authorId)
                {
                    x.HasUnreadMessages = true;
                }
                // when new message comes, then set archived state to false for all participants
                x.IsArchived = false;
            });

            await _chatParticipantRepository.UpdateRange(participants);
        }

        private List<ChatParticipant> MakeChatParticipants(IEnumerable<Guid> userIds, Guid? chatId = null)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            Guid[] ids = [userId, .. userIds];
            return ids.Select(x => new ChatParticipant(x) { ChatId = chatId ?? Guid.Empty }).DistinctBy(x => x.UserId).ToList();
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
                Message? lastMessage = x.Messages.SingleOrDefault();
                return new ChatPreview()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Type = x.Type,
                    HasUnreadMessages = currentUserParticipant.HasUnreadMessages,
                    LastMessage = lastMessage != null ? _extendedMapper.ToMessageDTO(lastMessage) : null,
                    Participants = _extendedMapper.ToUserDTOList(x.Participants.Select(x => x.User)),
                    IsIgnored = currentUserParticipant.IsIgnored,
                    IsArchived = currentUserParticipant.IsArchived,
                };
            }).OrderByDescending(x => x.LastMessage?.CreatedAt);
        }
    }
}
