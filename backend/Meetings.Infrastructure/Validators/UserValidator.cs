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
    public class UserValidator : AbstractValidator<UserDTO>
    {
        private readonly AuthService _authService;
        public UserValidator(AuthService authService)
        {
            _authService = authService;
            RuleFor(x => x.Email).EmailAddress(EmailValidationMode.Net4xRegex).WithErrorCode("EmailIncorrect");
            RuleFor(x => x.Email).MustAsync(BeUnique).WithErrorCode("EmailTaken");
            RuleFor(x => x.Password).Equal(x => x.PasswordRepeat).WithErrorCode("PasswordsNotMatch");
            RuleFor(x => x.Password).MinimumLength(5).WithErrorCode("PasswordTooShort");
            RuleFor(x => x.FirstName).NotEmpty().WithErrorCode("FirstNameEmpty");
            RuleFor(x => x.LastName).NotEmpty().WithErrorCode("LastNameEmpty");
            RuleFor(x => x.BirthDate).LessThan(DateTime.UtcNow).WithErrorCode("BirthDateIncorrect");
            RuleFor(x => x.Gender).IsInEnum().WithErrorCode("GenderIncorrect");      
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
