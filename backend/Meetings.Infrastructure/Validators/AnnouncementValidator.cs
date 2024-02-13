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
using Meetings.Utilities;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.EntityFrameworkCore;
using Meetings.Models.Resources;
using Humanizer;
using Meetings.Database.QueryExtensions;

namespace Meetings.Infrastructure.Validators
{
    public static class AnnouncementRuleBuilderExtensions
    {
        public static void AddCorrectDataRules(this InlineValidator<AnnouncementDTO> validator)
        {
            validator.RuleFor(x => x.Description).NotEmpty().WithErrorCode("DescriptionEmpty");
        }
        public static IRuleBuilderOptions<T, IEnumerable<int>> InRange<T>(this IRuleBuilder<T, IEnumerable<int>> ruleBuilder, int from, int to)
        {
            return ruleBuilder.Must(values =>
            {
                var list = values.ToList();

                if (list.Count != 2) return false;
                if (list[0] < from || list[0] > to) return false;
                if (list[1] < from || list[1] > to) return false;
                if (list[0] > list[1]) return false;
                return true;
            });
        }
        public static IRuleBuilderOptions<T, string> InCollection<T>(this IRuleBuilder<T, string> ruleBuilder, IEnumerable<string> collection)
        {
            return ruleBuilder.Must(value => collection.Contains(value));
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

        private async Task ValidateCanCreateAnnouncementInCategory(Guid categoryId)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            if (await _repository.Data.GetActivelyOccupiedByUser(userId).AnyAsync(x => x.CategoryId == categoryId))
            {
                ValidatorUtils.ThrowError("CategoryAlreadyOccupied");
            }
        }

        internal async Task WhenEditAnnouncement(AnnouncementDTO data)
        {
            await ValidateIsAuthorCurrentUser(data.Id);

            var validator = new InlineValidator<AnnouncementDTO>();
            validator.AddCorrectDataRules();

            validator.ValidateAndThrow(data);
        }

        internal async Task WhenCreateNewAnnouncement(AnnouncementDTO data)
        {
            await ValidateCanCreateAnnouncementInCategory(data.CategoryId);

            var validator = new InlineValidator<AnnouncementDTO>();
            validator.RuleFor(x => x.CategoryId).NotEmpty().WithErrorCode("CategoryIdEmpty");
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

        internal void WhenGetAnnouncementResultList(LoadAnnouncementResultListParams data)
        {
            var validator = new InlineValidator<LoadAnnouncementResultListParams>();
            validator.RuleFor(x => x.CategoryId).NotEmpty().WithErrorCode("CategoryIdEmpty");
            validator.RuleFor(x => x.DistanceMax).GreaterThanOrEqualTo(0).WithErrorCode("DistanceMaxNegative");
            validator.RuleFor(x => x.AgeRange).InRange(AnnouncementFilterConstants.MinAge, AnnouncementFilterConstants.MaxAge).WithErrorCode("IncorrectAgeRange");

            validator.ValidateAndThrow(data);
        }
    }
}
