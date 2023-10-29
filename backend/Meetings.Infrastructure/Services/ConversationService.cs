using AutoMapper;
using Meetings.Authentication.Services;
using Meetings.Database.Repositories;
using Meetings.EmailSender;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
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

            Conversation? conversation = await _repository.Data
                .Include(x => x.Messages.OrderBy(x => x.CreatedAt))
                .FirstOrDefaultAsync(x => x.ParticipantIds == orderedIds);
            if (createIfNotExist && conversation == null)
            {
                conversation = await _repository.Create(new Conversation()
                {
                    ParticipantIds = orderedIds
                });
            }

            return _mapper.Map<ConversationDTO>(conversation);
        }

        public async Task<List<MessageDTO>> GetLatestConversationMessages(Guid conversationId, DateTime? lastMessageDate)
        {
            //var messages = await _repositorawait _messageRepository.Data.Where(x => x.ConversationId == conversationIdy.Data.Where(x => x.Id == conversationId).Include(x => x.Messages.Where(x => x.CreatedAt > lastMessageDate)).SelectMany(x => x.Messages).ToListAsync();
            var query = _messageRepository.Data.Where(x => x.ConversationId == conversationId);
            if (lastMessageDate != null)
            {
                query = query.Where(x => x.CreatedAt > lastMessageDate);
            }
            var messages = await query.OrderBy(x => x.CreatedAt).ToListAsync();
            return _mapper.Map<List<MessageDTO>>(messages);
        }

        public async Task SendMessage(MessageDTO data)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            data.AuthorId = userId;

            await _messageRepository.Create(_mapper.Map<Message>(data));
        }
    }
}
