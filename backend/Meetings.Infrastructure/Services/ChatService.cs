using AutoMapper;
using Meetings.Authentication.Services;
using Meetings.Database.QueryExtensions;
using Meetings.Database.Repositories;
using Meetings.FileManager;
using Meetings.Infrastructure.Hubs;
using Meetings.Infrastructure.Mappers;
using Meetings.Infrastructure.Utils;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Meetings.Utils.Extensions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using static System.Net.Mime.MediaTypeNames;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Meetings.Infrastructure.Services
{
    public class ChatService
    {
        private readonly IRepository<Chat> _repository;
        private readonly IRepository<Message> _messageRepository;
        private readonly IRepository<ChatParticipant> _chatParticipantRepository;
        private readonly IMapper _mapper;
        private readonly IClaimsReader _claimsReader;
        private readonly IHubContext<ChatHub, IChatHub> _chatHubContext;
        private readonly ExtendedMapper _extendedMapper;
        private readonly IFileManager _fileManager;

        public ChatService(IRepository<Chat> repository, IMapper mapper, IClaimsReader claimsReader, IRepository<Message> messageRepository, IHubContext<ChatHub, IChatHub> chatHubContext, IRepository<ChatParticipant> chatParticipantRepository, ExtendedMapper extendedMapper, IFileManager fileManager)
        {
            _repository = repository;
            _mapper = mapper;
            _claimsReader = claimsReader;
            _messageRepository = messageRepository;
            _chatHubContext = chatHubContext;
            _chatParticipantRepository = chatParticipantRepository;
            _extendedMapper = extendedMapper;
            _fileManager = fileManager;
        }

        public async Task<ChatDTO?> GetPrivateChat(Guid participantId)
        {
            return await GetChat(ChatType.Private, participantId: participantId);
        }

        public async Task<ChatDTO> GetGroupChat(Guid chatId)
        {
            var result = await GetChat(ChatType.Group, chatId: chatId);
            return result!;
        }

        private async Task<ChatDTO?> GetChat(ChatType type, Guid chatId = default, Guid participantId = default)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            var queryResult = await _repository.Data
                .If(type == ChatType.Private, q => q.ByParticipants(userId, participantId))
                .If(type == ChatType.Group, q => q.Where(x => x.Id == chatId))
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    TotalMessagesAmount = x.Messages.Count(),
                    Participants = x.Participants.Select(x => x.User)
                })
                .SingleOrDefaultAsync();

            if (queryResult == null) return null;

            await MarkChatAsRead(queryResult.Id);

            return new ChatDTO()
            {
                Type = type,
                Id = queryResult.Id,
                Name = queryResult.Name,
                TotalMessagesAmount = queryResult.TotalMessagesAmount,
                Participants = _extendedMapper.ToUserDTOList(queryResult.Participants)
            };
        }

        public async Task<List<MessageDTO>> LoadChatMessages(Guid chatId, int skip, int take)
        {
            var messages = await _repository.Data.Where(x => x.Id == chatId)
                .IncludeAllMessagesData()
                .Select(x => x.Messages.OrderByDescending(x => x.CreatedAt).Skip(skip).Take(take).Reverse())
                .SingleOrDefaultAsync();

            return await _extendedMapper.ToMessageDTOList(messages);
        }

        public async Task<List<MessageDTO>> LoadAllMessagesAfterDate(Guid chatId, DateTime afterDate)
        {
            var messages = await _repository.Data.Where(x => x.Id == chatId)
                 .IncludeAllMessagesData()
                 .Select(x => x.Messages.OrderByDescending(x => x.CreatedAt).Where(x => x.CreatedAt >= afterDate).Reverse())
                 .SingleOrDefaultAsync();

            return await _extendedMapper.ToMessageDTOList(messages);
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
                    Value = data.Value!,
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
            Guid authorId = _claimsReader.GetCurrentUserId();
            // TODO check if user is in chat

            Message entity = await CreateMessage(authorId, data.ChatId, data);
            // refetch entity with required dependencies
            entity = await _messageRepository.GetById(entity.Id, q => q.IncludeAuthors());

            await SetUnreadMessages(data.ChatId, authorId);

            return await _extendedMapper.ToMessageDTO(entity);
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
            await _messageRepository.Update(message);

            return await _extendedMapper.ToMessageDTO(message);
        }

        public async Task<IEnumerable<ChatPreview>> GetCurrentUserChats(ChatType type)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            List<Chat> chats = await _repository.Data
                .IncludeParticipants()
                .IncludeLastMessageWithAuthor()
                .Where(x => x.Participants.Select(x => x.UserId).Contains(userId))
                .If(type == ChatType.Private, q => q.Where(x => x.Participants.Count == 2))
                .If(type == ChatType.Group, q => q.Where(x => x.Participants.Count > 2))
                .ToListAsync();

            return chats.Select(x =>
            {
                ChatParticipant currentUserParticipant = x.Participants.Single(x => x.UserId == userId);
                Message? lastMessage = x.Messages.SingleOrDefault();
                ChatPreview result = new ChatPreview()
                {
                    Id = x.Id,
                    Name = type == ChatType.Group ? x.Name! : null,
                    Type = type,
                    ImageSrcs = x.Participants.Where(x => x.UserId != userId).Select(x => _fileManager.FilePathToSrc(x.User.ProfileImagePath)),
                    LastMessageAuthorGender = lastMessage?.Author.Gender,
                    LastMessageAuthorFirstName = lastMessage?.Author.FirstName,
                    LastMessageValue = lastMessage?.Type == MessageType.Text ? lastMessage?.Value : null,
                    HasLastMessage = lastMessage != null,
                    HasUnreadMessages = currentUserParticipant.HasUnreadMessages,
                    LastMessageAuthorId = lastMessage?.AuthorId,
                    LastMessageDate = lastMessage?.CreatedAt,
                    LastMessageType = lastMessage?.Type,
                };

                if (type == ChatType.Private)
                {
                    ChatParticipant participant = x.Participants.Single(x => x.UserId != userId);
                    result.Name = $"{participant.User.FirstName} {participant.User.LastName}";
                    result.ParticipantId = participant.UserId;
                    result.ParticipantActiveStatus = UserUtils.DetermineUserActiveStatus(participant.User.LastActiveDate);
                }

                return result;
            }).OrderByDescending(x => x.LastMessageDate);
        }

        public async Task<int> GetUnreadChatsCount()
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            return await _chatParticipantRepository.Data.Where(x => x.UserId == userId && x.HasUnreadMessages).CountAsync();
        }

        public async Task MarkChatAsRead(Guid chatId)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            await _chatParticipantRepository.Data
                .Where(x => x.UserId == userId && x.ChatId == chatId)
                .ExecuteUpdateAsync(s =>
                    s.SetProperty(x => x.HasUnreadMessages, false)
                 );
        }

        public async Task<Guid> CreateGroupChat(CreateGroupChatData data)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            if (data.UserIds.Count < 2)
            {
                // TODO move to validator class
                throw new Exception();
            }

            List<ChatParticipant> participants = new List<ChatParticipant>(data.UserIds.Select(x => new ChatParticipant(x)))
            {
               new ChatParticipant(userId),
            };
            Guid chatId = await CreateNewChat(data.ConnectionId, participants, data.Name);

            return chatId;
        }


        public async Task<ChatDTO> CreatePrivateChat(CreatePrivateChatData data)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            if (await _repository.Data.ByParticipants(data.ParticipantId, userId).AnyAsync())
            {
                // TODO move to validator class
                throw new Exception();
            }

            List<ChatParticipant> participants = new List<ChatParticipant>()
            {
               new ChatParticipant(data.ParticipantId),
               new ChatParticipant(userId),
            };
            await CreateNewChat(data.ConnectionId, participants);
            return await GetPrivateChat(data.ParticipantId);
        }

        private async Task<Guid> CreateNewChat(string connectionId, List<ChatParticipant> participants, string name = null)
        {
            var createdChat = await _repository.Create(new Chat()
            {
                Participants = participants,
                Name = name
            });

            await _chatHubContext.Groups.AddToGroupAsync(connectionId, createdChat.Id.ToString());
            await _chatHubContext.Clients.Users(participants.Select(x => x.UserId.ToString())).OnNewChatCreated(createdChat.Id);

            return createdChat.Id;
        }

        private async Task SetUnreadMessages(Guid chatId, Guid authorId)
        {
            List<ChatParticipant> participants = await _chatParticipantRepository.Data.Where(x => x.ChatId == chatId && x.UserId != authorId).ToListAsync();
            participants.ForEach(x =>
            {
                x.HasUnreadMessages = true;
            });

            await _chatParticipantRepository.UpdateRange(participants);
        }
    }
}
