using AutoMapper;
using Meetings.Database.Repositories;
using Meetings.Infrastructure.Helpers;
using Meetings.Infrastructure.Mappers;
using Meetings.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Meetings.Infrastructure.Services
{
    public class MessageReactionService
    {
        private readonly IRepository<Message> _messageRepository;
        private readonly IRepository<MessageReaction> _repository;
        private readonly IMapper _mapper;
        private readonly ExtendedMapper _extendedMapper;
        private readonly IServices _services;

        public MessageReactionService(IMapper mapper,
                                      IRepository<Message> messageRepository,
                                      ExtendedMapper extendedMapper,
                                      IRepository<MessageReaction> repository,
                                      IServices services)
        {
            _repository = repository;
            _mapper = mapper;
            _messageRepository = messageRepository;
            _extendedMapper = extendedMapper;
            _services = services;
        }


        public async Task<MessageDTO> SetMessageReaction(MessageReactionDTO data)
        {
            Message message = await _messageRepository.GetById(data.MessageId, q => q.Include(x => x.Reactions));
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
            await _repository.UpdateRange(message.Reactions);

            return _extendedMapper.ToMessageDTO(message);
        }
    }
}
