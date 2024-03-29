﻿using FluentValidation.Validators;
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
using Humanizer;
using Meetings.Database.QueryExtensions;
using Meetings.Models.Resources.Pagination;

namespace Meetings.Infrastructure.Validators
{
    public static class AnnouncementRuleBuilderExtensions
    {
        public static void AddCorrectDataRules(this InlineValidator<AnnouncementDTO> validator)
        {
            validator.RuleFor(x => x.Description).NotEmpty().WithErrorCode("DescriptionEmpty");
        }
        public static void AddResultListFiltersRules<T>(this InlineValidator<T> validator) where T : ResultListFilters
        {
            validator.RuleFor(x => x.CategoryId).NotEmpty().WithErrorCode("CategoryIdEmpty");
            validator.RuleFor(x => x.DistanceMax).GreaterThanOrEqualTo(0).WithErrorCode("DistanceMaxNegative");
            validator.RuleFor(x => x.AgeRange).InRange(AnnouncementFilterConstants.MinAge, AnnouncementFilterConstants.MaxAge).WithErrorCode("IncorrectAgeRange");
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
        private readonly IRepository<Category> _categoryRepository;

        public AnnouncementValidator(IClaimsReader claimsReader, IRepository<Announcement> repository, IRepository<Category> categoryRepository)
        {
            _claimsReader = claimsReader;
            _repository = repository;
            _categoryRepository = categoryRepository;
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

        private async Task ValidateExperienceLevel(Guid categoryId, AnnouncementExperienceLevel? level)
        {
            bool categoryHasExperienceLevel = await _categoryRepository.Data.AnyAsync(x => x.Id == categoryId && x.HasExperienceLevel);
            if (categoryHasExperienceLevel && level == null)
            {
                ValidatorUtils.ThrowError("CategoryNeedExperienceLevel");
            }
            if (!categoryHasExperienceLevel && level != null)
            {
                ValidatorUtils.ThrowError("CategoryHasNoExperienceLevel");
            }
        }

        internal async Task WhenEditAnnouncement(AnnouncementDTO data)
        {
            await ValidateIsAuthorCurrentUser(data.Id);
            await ValidateExperienceLevel(data.CategoryId, data.ExperienceLevel);

            var validator = new InlineValidator<AnnouncementDTO>();
            validator.AddCorrectDataRules();

            validator.ValidateAndThrow(data);
        }

        internal async Task WhenCreateNewAnnouncement(AnnouncementDTO data)
        {
            await ValidateCanCreateAnnouncementInCategory(data.CategoryId);
            await ValidateExperienceLevel(data.CategoryId, data.ExperienceLevel);

            var validator = new InlineValidator<AnnouncementDTO>();
            validator.RuleFor(x => x.CategoryId).NotEmpty().WithErrorCode("CategoryIdEmpty");
            validator.AddCorrectDataRules();

            validator.ValidateAndThrow(data);
        }

        internal async Task WhenSetAnnouncementStatus(Guid id, AnnouncementStatus newStatus)
        {
            await ValidateIsAuthorCurrentUser(id);
            if (newStatus == AnnouncementStatus.Active) ValidatorUtils.ThrowError("StatusCannotBeActive");
        }

        internal async Task WhenRemoveAnnouncement(Guid id)
        {
            await ValidateIsAuthorCurrentUser(id);
        }

        internal void WhenGetAnnouncementResultList(GetAnnouncementResultListData data)
        {
            var validator = new InlineValidator<GetAnnouncementResultListData>();
            validator.AddResultListFiltersRules();

            validator.ValidateAndThrow(data);
        }
    }
}
