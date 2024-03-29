﻿using FluentValidation.Validators;
using FluentValidation;
using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Meetings.Database.Repositories;
using Meetings.Infrastructure.Services;
using Meetings.Models.Resources;
using Meetings.Authentication.Services;
using Meetings.Utilities;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Meetings.Infrastructure.Validators
{
    public static class UserRuleBuilderExtensions
    {
        private const int _passwordMinLength = 5;

        public static void AddPersonalDataRules<T>(this InlineValidator<T> validator) where T: UserDTO
        {
            validator.RuleFor(x => x.FirstName).NotEmpty().WithErrorCode("FirstNameEmpty");
            validator.RuleFor(x => x.LastName).NotEmpty().WithErrorCode("LastNameEmpty");
            validator.RuleFor(x => x.BirthDate).LessThan(DateTime.UtcNow).WithErrorCode("BirthDateIncorrect");
            validator.RuleFor(x => x.Gender).IsInEnum().WithErrorCode("GenderIncorrect");
            validator.RuleFor(x => x.LocationId).NotEmpty().WithErrorCode("LocationIncorrect");
        }

        public static IRuleBuilderOptions<T, string> PasswordMinLength<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder.MinimumLength(_passwordMinLength).WithErrorCode("PasswordTooShort");
        }
        
        public static IRuleBuilderOptions<T, string> PasswordCorrect<T>(this IRuleBuilder<T, string> ruleBuilder, User user)
        {
            return ruleBuilder.Must((password) => BeCorrect(password, user)).WithErrorCode("PasswordIncorrect");
        }

        public static IRuleBuilderOptions<T, string> Email<T>(this IRuleBuilder<T, string> ruleBuilder, Guid? userId, IRepository<User> repository)
        {
            return ruleBuilder
                .EmailAddress(EmailValidationMode.Net4xRegex).WithErrorCode("EmailIncorrect")
                .MustAsync(async (email, _) =>
                {
                    var userWithEmail = await repository.Data.SingleOrDefaultAsync(x => x.Email == email);
                    if (userWithEmail == null || userWithEmail.Id == userId)
                    {
                        return true;
                    }
                    return userWithEmail.Email != email;
                }).WithErrorCode("EmailTaken");
        }

        public static bool BeCorrect(string password, User user)
        {
            return Hasher.Verify(password, user.Password);
        }
    }

    public class UserValidator
    {
        public const int PasswordMinLength = 5;
        private readonly IRepository<User> _repository;
        private readonly IRepository<BlockedUser> _blockedUserRepository;
        private readonly IClaimsReader _claimsReader;
        public UserValidator(IRepository<User> userRepository, IRepository<BlockedUser> blockedUserRepository, IClaimsReader claimsReader)
        {
            _repository = userRepository;
            _blockedUserRepository = blockedUserRepository;
            _claimsReader = claimsReader;
        }

        internal async Task WhenRegister(RegisterData data)
        {
            var validator = new InlineValidator<RegisterData>();
            validator.AddPersonalDataRules();
            validator.RuleFor(x => x.Password).Equal(x => x.PasswordRepeat).WithErrorCode("PasswordsNotMatch");
            validator.RuleFor(x => x.Password).PasswordMinLength();
            validator.RuleFor(x => x.Email).Email(null, _repository);

            await validator.ValidateAndThrowAsync(data);
        }

        internal async Task WhenChangeEmailAddress(ChangeEmailAddressData data, User user)
        {
            var validator = new InlineValidator<ChangeEmailAddressData>();
            validator.RuleFor(x => x.Password).PasswordCorrect(user);
            validator.RuleFor(x => x.Email).Email(user.Id, _repository);

            await validator.ValidateAndThrowAsync(data);
        }

        internal async Task WhenChangePersonalData(UserDTO data)
        {
            var validator = new InlineValidator<UserDTO>();
            validator.AddPersonalDataRules();
            await validator.ValidateAndThrowAsync(data);
        }

        internal async Task WhenResetPassword(ResetPasswordData data)
        {
            var validator = new InlineValidator<ResetPasswordData>();
            validator.RuleFor(x => x.NewPassword).PasswordMinLength();

            await validator.ValidateAndThrowAsync(data);
        }

        internal async Task WhenChangePassword(ChangePasswordData data, User user)
        {
            var validator = new InlineValidator<ChangePasswordData>();
            validator.RuleFor(x => x.ExistingPassword).PasswordCorrect(user);
            validator.RuleFor(x => x.NewPassword).PasswordMinLength();

            await validator.ValidateAndThrowAsync(data);
        }

        internal async Task WhenBlockUser(Guid id)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            if (await _blockedUserRepository.Data.AnyAsync(x => x.UserId == userId && x.BlockedId == id))
            {
                ValidatorUtils.ThrowError("UserAlreadyBlocked");
            }
        }
    }
}
