using FluentValidation;
using Meetings.Authentication.Services;
using Meetings.Database.Repositories;
using Meetings.Models.Entities;
using Meetings.Models.Resources.Pagination;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Validators
{
    public class ObservedSearchValidator
    {
        private readonly IClaimsReader _claimsReader;
        private readonly IRepository<ObservedSearch> _repository;
        public ObservedSearchValidator(IClaimsReader claimsReader, IRepository<ObservedSearch> repository)
        {
            _claimsReader = claimsReader;
            _repository = repository;
        }

        internal async Task WhenAddObservedSearch(ObservedSearchDTO data, bool isSearchObservedByCurrentUser)
        {
            if (isSearchObservedByCurrentUser)
            {
                ValidatorUtils.ThrowError("SearchAlreadyObserved");
            }

            var validator = new InlineValidator<ObservedSearchDTO>();
            validator.RuleFor(x => x.NewAnnouncementsCount).Equal(0).WithErrorCode("NewAnnouncementsCountIsNotZero");
            validator.RuleFor(x => x.ResultListUrl).NotEmpty().WithErrorCode("ResultListUrlEmpty");
            validator.AddResultListFiltersRules();

            validator.ValidateAndThrow(data);
        }

        internal async Task WhenRemoveObservedSearch(Guid id)
        {
            await ValidateIsAuthorCurrentUser(id);
        }

        private async Task ValidateIsAuthorCurrentUser(Guid id)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            if (!await _repository.Data.AnyAsync(x => x.Id == id && x.UserId == userId))
            {
                ValidatorUtils.ThrowError("CurrentUserIsNotAuthor");
            }
        }
    }
}
