using FluentValidation;
using FluentValidation.Results;
using Meetings.Authentication.Services;
using Meetings.Database.Repositories;
using Meetings.Infrastructure.Mappers;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Meetings.Infrastructure.Validators
{
    public class ChatValidator
    {
        private readonly IRepository<Chat> _repository;
        private readonly IRepository<ChatParticipant> _chatParticipantRepository;
        private readonly IRepository<Message> _messageRepository;
        private readonly IClaimsReader _claimsReader;
        private readonly ExtendedMapper _extendedMapper;
        public ChatValidator(IRepository<Chat> userRepository, IClaimsReader claimsReader, IRepository<ChatParticipant> chatParticipantRepository, IRepository<Message> messageRepository, ExtendedMapper extendedMapper)
        {
            _repository = userRepository;
            _claimsReader = claimsReader;
            _chatParticipantRepository = chatParticipantRepository;
            _messageRepository = messageRepository;
            _extendedMapper = extendedMapper;
        }

        private async Task<bool> IsUserInChatAsync(Guid chatId, Guid userId)
        {
            return await _chatParticipantRepository.Data.AnyAsync(x => x.UserId == userId && x.ChatId == chatId);
        }
        private async Task ValidateIsCurrentUserInChatAsync(Guid chatId)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            if (!await IsUserInChatAsync(chatId, userId))
            {
                ValidatorUtils.ThrowError("NotInChat");
            }
        }

        internal async Task WhenGetGroupChat(Guid chatId)
        {
            await ValidateIsCurrentUserInChatAsync(chatId);
        }

        internal async Task WhenChangeGroupChatName(ChangeGroupChatNameData data)
        {
            await ValidateIsCurrentUserInChatAsync(data.ChatId);

            var validator = new InlineValidator<ChangeGroupChatNameData>();
            validator.RuleFor(x => x.Name).NotEmpty().WithErrorCode("EmptyChatName");
            await validator.ValidateAndThrowAsync(data);
        }

        internal async Task WhenAddGroupChatParticipant(Guid chatId, Guid userId)
        {
            await ValidateIsCurrentUserInChatAsync(chatId);

            if (await IsUserInChatAsync(chatId, userId))
            {
                ValidatorUtils.ThrowError("AlreadyInChat");
            }
        }

        internal async Task WhenRemoveGroupChatParticipant(Guid chatId, Guid userId)
        {
            await ValidateIsCurrentUserInChatAsync(chatId);

            if (!await IsUserInChatAsync(chatId, userId))
            {
                ValidatorUtils.ThrowError("UserIsNotInChat");
            }
        }

        internal async Task WhenSendMessage(SendMessageData data)
        {
            await ValidateIsCurrentUserInChatAsync(data.ChatId);

            if (data.ReplyToId != null)
            {
                if (!await _messageRepository.Data.AnyAsync(x => x.Id == data.ReplyToId && x.ChatId == data.ChatId))
                {
                    ValidatorUtils.ThrowError("ReplyToIsInDifferentChat");
                }
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

        internal async Task WhenGetAllImageMessages(Guid chatId)
        {
            await ValidateIsCurrentUserInChatAsync(chatId);
        }
    }
}
