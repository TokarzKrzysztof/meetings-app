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

namespace Meetings.Infrastructure.Validators
{
    public class UserValidator
    {
        private readonly AuthService _authService;
        public UserValidator(AuthService authService)
        {
            _authService = authService;
        }

        public async Task WhenCreate(UserDTO data)
        {
            var validator = new InlineValidator<UserDTO>();
            validator.RuleFor(x => x.Email).EmailAddress(EmailValidationMode.Net4xRegex).WithErrorCode("EmailIncorrect");
            validator.RuleFor(x => x.Email).MustAsync(BeUnique).WithErrorCode("EmailTaken");
            validator.RuleFor(x => x.Password).Equal(x => x.PasswordRepeat).WithErrorCode("PasswordsNotMatch");
            validator.RuleFor(x => x.Password).MinimumLength(5).WithErrorCode("PasswordTooShort");
            validator.RuleFor(x => x.FirstName).NotEmpty().WithErrorCode("FirstNameEmpty");
            validator.RuleFor(x => x.LastName).NotEmpty().WithErrorCode("LastNameEmpty");
            validator.RuleFor(x => x.BirthDate).LessThan(DateTime.UtcNow).WithErrorCode("BirthDateIncorrect");
            validator.RuleFor(x => x.Gender).IsInEnum().WithErrorCode("GenderIncorrect");

            await validator.ValidateAndThrowAsync(data);
        }

        private async Task<bool> BeUnique(UserDTO instance, string value, CancellationToken token)
        {
            var userWithEmail = await _authService.TryGetUserByEmail(value);
            if (userWithEmail == null || userWithEmail.Id == instance.Id)
            {
                return true;
            }
            return userWithEmail.Email != value;
        }
    }
}
