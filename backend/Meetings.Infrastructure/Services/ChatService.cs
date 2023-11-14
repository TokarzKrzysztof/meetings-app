using AutoMapper;
using Meetings.Authentication.Services;
using Meetings.Database.Repositories;
using Meetings.EmailSender;
using Meetings.Infrastructure.Hubs;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Utils.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Services
{
    public class ChatService
    {
        private readonly IRepository<Chat> _repository;
        private readonly IRepository<Message> _messageRepository;
        private readonly IRepository<MessageReaction> _messageReactionRepository;
        private readonly IRepository<User> _userRepository;
        private readonly IMapper _mapper;
        private readonly IClaimsReader _claimsReader;
        private readonly IHubContext<ChatHub> _chatHubContext;

        public ChatService(IRepository<Chat> repository, IMapper mapper, IClaimsReader claimsReader, IRepository<Message> messageRepository, IRepository<MessageReaction> messageReactionRepository, IRepository<User> userRepository, IHubContext<ChatHub> chatHubContext)
        {
            _repository = repository;
            _mapper = mapper;
            _claimsReader = claimsReader;
            _messageRepository = messageRepository;
            _messageReactionRepository = messageReactionRepository;
            _userRepository = userRepository;
            _chatHubContext = chatHubContext;
        }

        public async Task<ChatDTO?> GetPrivateChat(Guid participantId, int messagesAmount)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            var queryResult = await GetPrivateChatQuery(userId, participantId)
                .Include(x => x.Messages).ThenInclude(x => x.Reactions)
                .Include(x => x.Messages).ThenInclude(x => x.ReplyTo)
                .Select(x => new
                {
                    x.Id,
                    TotalMessagesAmount = x.Messages.Count(),
                    Messages = x.Messages.OrderByDescending(x => x.CreatedAt).Take(messagesAmount).Reverse()
                })
                .SingleOrDefaultAsync();

            if (queryResult == null) return null;

            return new ChatDTO()
            {
                Id = queryResult.Id,
                Messages = _mapper.Map<List<MessageDTO>>(queryResult.Messages),
                TotalMessagesAmount = queryResult.TotalMessagesAmount
            };
        }

        public async Task<List<MessageDTO>> GetMoreChatMessages(Guid chatId, int skip, int take)
        {
            var messages = await _repository.Data.Where(x => x.Id == chatId)
                .Include(x => x.Messages).ThenInclude(x => x.Reactions)
                .Select(x => x.Messages.OrderByDescending(x => x.CreatedAt).Skip(skip).Take(take).Reverse())
                .SingleOrDefaultAsync();

            await Task.Delay(1000);
            return _mapper.Map<List<MessageDTO>>(messages);
        }

        public async Task<MessageDTO> SendPrivateMessage(string connectionId, Guid recipientId, MessageDTO data)
        {
            Guid chatId = await GetPrivateChatQuery(data.AuthorId, recipientId).Select(x => x.Id).SingleOrDefaultAsync();
            if (chatId == Guid.Empty)
            {
                List<User> users = new List<User>()
                {
                    _userRepository.Attach(new User() { Id = data.AuthorId }),
                    _userRepository.Attach(new User() { Id = recipientId })
                };

                var createdChat = await _repository.Create(new Chat()
                {
                    Participants = users
                });
                chatId = createdChat.Id;

                await _chatHubContext.Groups.AddToGroupAsync(connectionId, chatId.ToString());
            }

            var entity = await _messageRepository.Create(new Message()
            {
                AuthorId = data.AuthorId,
                ChatId = chatId,
                Text = data.Text,
                ReplyToId = data.ReplyTo?.Id
            });

            var result = _mapper.Map<MessageDTO>(entity);
            result.ReplyTo = data.ReplyTo;
            return result;
        }

        public async Task<MessageDTO> SetMessageReaction(MessageReactionDTO data)
        {
            Message message = await _messageRepository.Data.Where(x => x.Id == data.MessageId).Include(x => x.Reactions).Include(x => x.ReplyTo).SingleAsync();
            var authorReaction = message.Reactions.SingleOrDefault(x => x.AuthorId == data.AuthorId);
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

            return _mapper.Map<MessageDTO>(message);
        }

        private IQueryable<Chat> GetPrivateChatQuery(Guid participant1Id, Guid participant2Id)
        {
            return _repository.Data
                .Where(x => x.Participants.Select(x => x.Id).Contains(participant1Id) && x.Participants.Select(x => x.Id).Contains(participant2Id));
        }
    }
}
