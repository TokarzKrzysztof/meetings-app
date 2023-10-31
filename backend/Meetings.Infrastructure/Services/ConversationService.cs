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

        public async Task<ConversationDTO> GetConversation(Guid participantId, bool createIfNotExist)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            List<string> orderedIds = new[] { userId.ToString(), participantId.ToString() }.OrderBy(x => x).ToList();

            Conversation? conversation = await TryGetConversationByParticipants(userId, participantId, true);
            if (createIfNotExist && conversation == null)
            {
                conversation = await _repository.Create(new Conversation()
                {
                    ParticipantIds = orderedIds
                });
            }

            return _mapper.Map<ConversationDTO>(conversation);
        }

        public async Task<MessageDTO> SendMessage(Guid authorId, string message, Guid recipientId)
        {
            var conversation = await TryGetConversationByParticipants(authorId, recipientId, false);
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
            List<string> orderedIds = new[] { participant1Id.ToString(), participant2Id.ToString() }.OrderBy(x => x).ToList();
            Conversation? conversation = await _repository.Data
                .If(includeMessages, q => q.Include(x => x.Messages.OrderBy(x => x.CreatedAt)))
                .FirstOrDefaultAsync(x => x.ParticipantIds == orderedIds);

            return conversation;
        }
    }
}
