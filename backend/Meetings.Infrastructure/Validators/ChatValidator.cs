using FluentValidation;
using FluentValidation.Results;
using Meetings.Authentication.Services;
using Meetings.Database.Repositories;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Validators
{
    public class ChatValidator
    {
        private readonly IRepository<Chat> _repository;
        private readonly IRepository<ChatParticipant> _chatParticipantRepository;
        private readonly IClaimsReader _claimsReader;
        public ChatValidator(IRepository<Chat> userRepository, IClaimsReader claimsReader, IRepository<ChatParticipant> chatParticipantRepository)
        {
            _repository = userRepository;
            _claimsReader = claimsReader;
            _chatParticipantRepository = chatParticipantRepository;
        }

        internal void AfterGetGroupChat(ChatDTO chat)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            if (!chat.Participants.Any(x => x.Id == userId))
            {
                ValidatorUtils.ThrowError("NotInChat");
            }
        }

        internal async Task WhenSendMessage(SendMessageData data)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            if (!await _chatParticipantRepository.Data.AnyAsync(x => x.UserId == userId && x.ChatId == data.ChatId))
            {
                ValidatorUtils.ThrowError("NotInChat");
            }

            var validator = new InlineValidator<SendMessageData>();
            validator.RuleFor(x => x).Must(x =>
            {
                if (x.Type == MessageType.Text)
                {
                    return !string.IsNullOrWhiteSpace(x.Value);
                }
                else
                {
                    return x.File != null;
                }
            }).WithErrorCode("IncorrectValueForType");

            await validator.ValidateAndThrowAsync(data);
        }
    }
}
