using FluentValidation.Validators;
using FluentValidation;
using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Meetings.Infrastructure.Helpers;
using Meetings.Authentication.Services;
using Meetings.Database.Repositories;
using Meetings.Utils;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.EntityFrameworkCore;

namespace Meetings.Infrastructure.Validators
{
    public static class AnnouncementRuleBuilderExtensions
    {
        public static void AddCorrectDataRules(this InlineValidator<AnnouncementDTO> validator)
        {
            validator.RuleFor(x => x.CategoryId).NotEmpty().WithErrorCode("CategoryIdEmpty");
            validator.RuleFor(x => x.Description).NotEmpty().WithErrorCode("DescriptionEmpty");
        }
    }

    public class AnnouncementValidator
    {
        private readonly IClaimsReader _claimsReader;
        private readonly IRepository<Announcement> _repository;

        public AnnouncementValidator(IClaimsReader claimsReader, IRepository<Announcement> repository)
        {
            _claimsReader = claimsReader;
            _repository = repository;
        }

        private async Task ValidateIsAuthorCurrentUser(Guid announcementId)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            if (!await _repository.Data.AnyAsync(x => x.Id == announcementId && x.UserId == userId))
            {
                ValidatorUtils.ThrowError("CurrentUserIsNotAuthor");
            }
        }

        internal async Task WhenEditAnnouncement(AnnouncementDTO data)
        {
            await ValidateIsAuthorCurrentUser(data.Id);

            var validator = new InlineValidator<AnnouncementDTO>();
            validator.AddCorrectDataRules();

            validator.ValidateAndThrow(data);
        }

        internal void WhenCreateNewAnnouncement(AnnouncementDTO data)
        {
            var validator = new InlineValidator<AnnouncementDTO>();
            validator.AddCorrectDataRules();

            validator.ValidateAndThrow(data);
        }

        internal async Task WhenSetAnnouncementStatus(Guid id)
        {
            await ValidateIsAuthorCurrentUser(id);
        }

        internal async Task WhenRemoveAnnouncement(Guid id)
        {
            await ValidateIsAuthorCurrentUser(id);
        }
    }
}
