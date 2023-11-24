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

        public ChatService(IRepository<Chat> repository, IMapper mapper, IClaimsReader claimsReader, IRepository<Message> messageRepository, IHubContext<ChatHub, IChatHub> chatHubContext, IRepository<ChatParticipant> chatParticipantRepository, ExtendedMapper extendedMapper)
        {
            _repository = repository;
            _mapper = mapper;
            _claimsReader = claimsReader;
            _messageRepository = messageRepository;
            _chatHubContext = chatHubContext;
            _chatParticipantRepository = chatParticipantRepository;
            _extendedMapper = extendedMapper;
        }

        public async Task<ChatDTO?> GetPrivateChat(Guid participantId, int messagesAmount)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            var queryResult = await _repository.Data
                .ByParticipants(userId, participantId)
                .IncludeAllMessagesData()
                .Select(x => new
                {
                    x.Id,
                    TotalMessagesAmount = x.Messages.Count(),
                    Messages = x.Messages.OrderByDescending(x => x.CreatedAt).Take(messagesAmount).Reverse(),
                })
                .SingleOrDefaultAsync();

            if (queryResult == null) return null;

            await MarkChatAsRead(queryResult.Id);

            return new ChatDTO()
            {
                Id = queryResult.Id,
                Messages = await _extendedMapper.ToMessageDTOList(queryResult.Messages),
                TotalMessagesAmount = queryResult.TotalMessagesAmount
            };
        }

        public async Task<List<MessageDTO>> LoadMoreChatMessages(Guid chatId, int skip, int take)
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

        private async Task<Message> CreateMessage(Guid authorId, Guid chatId, SendPrivateMessageData data)
        {
            if (data.Type == MessageType.Image)
            {
                var filePath = Path.Combine(FileUtils.Root, "Chats", chatId.ToString(), $"{Guid.NewGuid()}.jpg");
                await FileUtils.Save(filePath, data.File!);

                return await _messageRepository.Create(new Message()
                {
                    AuthorId = authorId,
                    ChatId = chatId,
                    ReplyToId = data.ReplyToId,
                    Value = filePath,
                    Type = MessageType.Image,
                }, (x) => x.ReplyTo);
            }

            return await _messageRepository.Create(new Message()
            {
                AuthorId = authorId,
                ChatId = chatId,
                ReplyToId = data.ReplyToId,
                Value = data.Value!,
                Type = MessageType.Text,
            }, (x) => x.ReplyTo);
        }

        public async Task<MessageDTO> SendPrivateMessage(SendPrivateMessageData data)
        {
            Guid authorId = _claimsReader.GetCurrentUserId();

            Guid chatId = await _repository.Data.ByParticipants(authorId, data.RecipientId).Select(x => x.Id).SingleOrDefaultAsync();
            if (chatId == Guid.Empty)
            {
                chatId = await CreateNewChat(authorId, data);
            }
            Message entity = await CreateMessage(authorId, chatId, data);

            await SetUnreadMessages(chatId, authorId);

            return await _extendedMapper.ToMessageDTO(entity);
        }

        public async Task<MessageDTO> SetMessageReaction(MessageReactionDTO data)
        {
            Message message = await _messageRepository.Data.Where(x => x.Id == data.MessageId).Include(x => x.Reactions).Include(x => x.ReplyTo).SingleAsync();
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

        public async Task<IEnumerable<ChatPreview>> GetCurrentUserChats()
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            List<Chat> chats = await _repository.Data
                .Include(x => x.Participants).ThenInclude(x => x.User)
                .Include(x => x.Messages.OrderByDescending(msg => msg.CreatedAt).Take(1))
                .Where(x => x.Participants.Select(x => x.UserId).Contains(userId))
                .ToListAsync();

            return chats.Select(x =>
            {
                ChatParticipant participant = x.Participants.Single(x => x.UserId != userId);
                ChatParticipant currentUserParticipant = x.Participants.Single(x => x.UserId == userId);
                Message? lastMessage = x.Messages.OrderByDescending(msg => msg.CreatedAt).FirstOrDefault();
                return new ChatPreview()
                {
                    Id = x.Id,
                    ParticipantId = participant.UserId,
                    ParticipantName = $"{participant.User.FirstName} {participant.User.LastName}",
                    ParticipantActiveStatus = UserUtils.DetermineUserActiveStatus(participant.User.LastActiveDate),
                    HasUnreadMessages = currentUserParticipant.HasUnreadMessages,
                    LastMessageAuthorId = lastMessage?.AuthorId,
                    LastMessageText = lastMessage?.Value,
                    LastMessageDate = lastMessage?.CreatedAt,
                };
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

        private async Task<Guid> CreateNewChat(Guid authorId, SendPrivateMessageData data)
        {
            List<ChatParticipant> participants = new List<ChatParticipant>()
            {
                    new ChatParticipant(authorId),
                    new ChatParticipant(data.RecipientId)
                    {
                        HasUnreadMessages = true
                    }
                };

            var createdChat = await _repository.Create(new Chat()
            {
                Participants = participants
            });

            await _chatHubContext.Groups.AddToGroupAsync(data.ConnectionId, createdChat.Id.ToString());
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
