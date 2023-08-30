using FluentValidation;
using FluentValidation.Validators;
using Meetings.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Entities
{
    public enum Gender
    {
        Male,
        Female
    }

    public class User : EntityBase
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public Gender Gender { get; set; }
    }

    public class UserResource
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PasswordRepeat { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public Gender Gender { get; set; }
    }


    public class UserValidator : AbstractValidator<UserResource>
    {
        public UserValidator()
        {
            RuleFor(x => x.Email).EmailAddress(EmailValidationMode.Net4xRegex).WithErrorCode("EmailIncorrect");
            RuleFor(x => x.Password).Equal(x => x.PasswordRepeat).WithErrorCode("PasswordsNotMatch");
            RuleFor(x => x.Password).MinimumLength(5).WithErrorCode("PasswordTooShort");
            RuleFor(x => x.FirstName).NotEmpty().WithErrorCode("FirstNameEmpty");
            RuleFor(x => x.LastName).NotEmpty().WithErrorCode("LastNameEmpty");
            RuleFor(x => x.BirthDate).LessThan(DateTime.UtcNow).WithErrorCode("BirthDateIncorrect");
            RuleFor(x => x.Gender).IsInEnum().WithErrorCode("GenderIncorrect");
        }
    }
}
