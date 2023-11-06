using AutoMapper;
using Meetings.Authentication.Services;
using Meetings.Database.Repositories;
using Meetings.EmailSender;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Utils.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        private readonly IMapper _mapper;
        private readonly IClaimsReader _claimsReader;
        public ChatService(IRepository<Chat> repository, IMapper mapper, IClaimsReader claimsReader, IRepository<Message> messageRepository, IRepository<MessageReaction> messageReactionRepository)
        {
            _repository = repository;
            _mapper = mapper;
            _claimsReader = claimsReader;
            _messageRepository = messageRepository;
            _messageReactionRepository = messageReactionRepository;
        }

        public async Task<ChatDTO?> GetChat(Guid participantId)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            Chat? chat = await TryGetChatByParticipants(userId, participantId, true);

            return chat != null ? _mapper.Map<ChatDTO>(chat) : null;
        }

        public async Task<MessageDTO> SendMessage(Guid authorId, string message, Guid recipientId)
        {
            Chat? chat = await TryGetChatByParticipants(authorId, recipientId, false);
            if (chat == null)
            {
                List<Guid> orderedIds = new[] { authorId, recipientId }.OrderBy(x => x).ToList();
                chat = await _repository.Create(new Chat()
                {
                    ParticipantIds = orderedIds
                });
            }

            var result = await _messageRepository.Create(new Message()
            {
                AuthorId = authorId,
                ChatId = chat.Id,
                Text = message
            });

            return _mapper.Map<MessageDTO>(result);
        }

        public async Task<MessageDTO> AddMessageReaction(MessageReactionDTO data)
        {
            Message message = await _messageRepository.Data.Where(x => x.Id == data.MessageId).Include(x => x.Reactions).SingleAsync();
            var authorReaction = message.Reactions.SingleOrDefault(x => x.AuthorId == data.AuthorId);
            if (authorReaction != null)
            {
                authorReaction.Unified = data.Unified;
            }
            else
            {
                message.Reactions.Add(_mapper.Map<MessageReaction>(data));
            }
            await _messageRepository.Update(message);

            return _mapper.Map<MessageDTO>(message);
        }

        private async Task<Chat> TryGetChatByParticipants(Guid participant1Id, Guid participant2Id, bool includeMessages)
        {
            List<Guid> orderedIds = new[] { participant1Id, participant2Id }.OrderBy(x => x).ToList();
            Chat? chat = await _repository.Data
                .If(includeMessages, q => q.Include(x => x.Messages.OrderBy(x => x.CreatedAt)).ThenInclude(x => x.Reactions))
                .FirstOrDefaultAsync(x => x.ParticipantIds == orderedIds);

            return chat;
        }
    }
}
