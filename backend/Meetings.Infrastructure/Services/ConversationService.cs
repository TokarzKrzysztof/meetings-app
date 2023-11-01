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
    public class ConversationService
    {
        private readonly IRepository<Conversation> _repository;
        private readonly IRepository<Message> _messageRepository;
        private readonly IMapper _mapper;
        private readonly IClaimsReader _claimsReader;
        public ConversationService(IRepository<Conversation> repository, IMapper mapper, IClaimsReader claimsReader, IRepository<Message> messageRepository)
        {
            _repository = repository;
            _mapper = mapper;
            _claimsReader = claimsReader;
            _messageRepository = messageRepository;
        }

        public async Task<ConversationDTO?> GetConversation(Guid participantId)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            Conversation? conversation = await TryGetConversationByParticipants(userId, participantId, true);

            return conversation != null ? _mapper.Map<ConversationDTO>(conversation) : null;
        }

        public async Task<MessageDTO> SendMessage(Guid authorId, string message, Guid recipientId)
        {
            Conversation? conversation = await TryGetConversationByParticipants(authorId, recipientId, false);
            if (conversation == null)
            {
                List<Guid> orderedIds = new[] { authorId, recipientId }.OrderBy(x => x).ToList();
                conversation = await _repository.Create(new Conversation()
                {
                    ParticipantIds = orderedIds
                });
            }

            var result = await _messageRepository.Create(new Message()
            {
                AuthorId = authorId,
                ConversationId = conversation.Id,
                Text = message
            });

            return _mapper.Map<MessageDTO>(result);
        }

        private async Task<Conversation> TryGetConversationByParticipants(Guid participant1Id, Guid participant2Id, bool includeMessages)
        {
            List<Guid> orderedIds = new[] { participant1Id, participant2Id }.OrderBy(x => x).ToList();
            Conversation? conversation = await _repository.Data
                .If(includeMessages, q => q.Include(x => x.Messages.OrderBy(x => x.CreatedAt)))
                .FirstOrDefaultAsync(x => x.ParticipantIds == orderedIds);

            return conversation;
        }
    }
}
