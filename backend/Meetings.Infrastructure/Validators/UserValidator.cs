using FluentValidation.Validators;
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
using Meetings.Utils;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Meetings.Infrastructure.Validators
{
    public class UserValidator
    {
        public const int PasswordMinLength = 5;
        private readonly IRepository<User> _repository;
        public UserValidator(IRepository<User> userRepository)
        {
            _repository = userRepository;
        }

        internal async Task WhenRegister(UserDTO data)
        {
            var validator = new InlineValidator<UserDTO>();
            validator.RuleFor(x => x.Email).EmailAddress(EmailValidationMode.Net4xRegex).WithErrorCode("EmailIncorrect");
            validator.RuleFor(x => x.Email).MustAsync(BeUnique).WithErrorCode("EmailTaken");
            validator.RuleFor(x => x.Password).Equal(x => x.PasswordRepeat).WithErrorCode("PasswordsNotMatch");
            AddPersonalDataRules(validator);
            AddPasswordMinLengthRule(validator, data.Password);
            
            await validator.ValidateAndThrowAsync(data);
        }

        internal async Task WhenChangePersonalData(UserDTO data)
        {
            var validator = new InlineValidator<UserDTO>();
            AddPersonalDataRules(validator);
            await validator.ValidateAndThrowAsync(data);
        }

        internal async Task WhenResetPassword(ResetPasswordData data)
        {
            var validator = new InlineValidator<ResetPasswordData>();
            AddPasswordMinLengthRule(validator, data.NewPassword);

            await validator.ValidateAndThrowAsync(data);
        }

        internal async Task WhenChangePassword(ChangePasswordData data, User user)
        {
            var validator = new InlineValidator<ChangePasswordData>();
            validator.RuleFor(x => x.ExistingPassword).Must((instance, value) => BeCorrect(value, user)).WithErrorCode("PasswordIncorrect");
            AddPasswordMinLengthRule(validator, data.NewPassword);

            await validator.ValidateAndThrowAsync(data);
        }

        internal void WhenLogin(LoginCredentials data, User user)
        {
            if (user == null || !BeCorrect(data.Password, user))
            {
                throw new UnauthorizedAccessException();
            }
            if (!user.IsActive)
            {
                throw new UnauthorizedAccessException("UserNotActive");
            }
        }

        private async Task<bool> BeUnique(UserDTO instance, string value, CancellationToken token)
        {
            var userWithEmail = await _repository.Data.SingleOrDefaultAsync(x => x.Email == value);
            if (userWithEmail == null || userWithEmail.Id == instance.Id)
            {
                return true;
            }
            return userWithEmail.Email != value;
        }

        private bool BeCorrect(string password, User user)
        {
            return Hasher.Verify(password, user.Password);
        } 

        private void AddPasswordMinLengthRule<T>(InlineValidator<T> validator, string password)
        {
            validator.RuleFor(x => password).MinimumLength(PasswordMinLength).WithErrorCode("PasswordTooShort");
        } 
        
        private void AddPersonalDataRules(InlineValidator<UserDTO> validator)
        {
            validator.RuleFor(x => x.FirstName).NotEmpty().WithErrorCode("FirstNameEmpty");
            validator.RuleFor(x => x.LastName).NotEmpty().WithErrorCode("LastNameEmpty");
            validator.RuleFor(x => x.BirthDate).LessThan(DateTime.UtcNow).WithErrorCode("BirthDateIncorrect");
            validator.RuleFor(x => x.Gender).IsInEnum().WithErrorCode("GenderIncorrect");
        }
    }
}
