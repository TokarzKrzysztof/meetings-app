using FluentValidation.Validators;
using FluentValidation;
using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Meetings.Infrastructure.Helpers;

namespace Meetings.Infrastructure.Validators
{
    public class AnnouncementValidator
    {
        public void WhenCreate(AnnouncementDTO data)
        {
            var validator = new InlineValidator<AnnouncementDTO>();
            validator.RuleFor(x => x.CategoryId).NotEmpty().WithErrorCode("CategoryIdEmpty");
            validator.RuleFor(x => x.Description).NotEmpty().WithErrorCode("DescriptionEmpty");

            validator.ValidateAndThrow(data);
        }
    }
}
