using Meetings.Infrastructure.Mappers;
using Meetings.Infrastructure.Utils;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Models.Resources.Pagination;
using Meetings.Models.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Meetings.Infrastructure.Helpers;
using Meetings.Database.Repositories;
using Meetings.FileManager;
using Microsoft.EntityFrameworkCore;
using Meetings.Authentication.Services;
using Microsoft.AspNetCore.Http;

namespace Meetings.Infrastructure.Services
{
    public class AnnouncementResultListService
    {
        private readonly IRepository<Announcement> _repository;
        private readonly IServices _services;
        private readonly AnnouncementValidator _announcementValidator;
        private readonly ExtendedMapper _extendedMapper;
        private readonly IClaimsReader _claimsReader;

        public AnnouncementResultListService(AnnouncementValidator announcementValidator, IServices services, IRepository<Announcement> repository, ExtendedMapper extendedMapper, IClaimsReader claimsReader)
        {
            _repository = repository;
            _services = services;
            _announcementValidator = announcementValidator;
            _extendedMapper = extendedMapper;
            _claimsReader = claimsReader;
        }

        public async Task<PaginatedData<AnnouncementResultListItem>> GetAnnouncementResultList(GetAnnouncementResultListData data)
        {
            _announcementValidator.WhenGetAnnouncementResultList(data);

            var currentUser = await _services.User.TryGetCurrentUserEntity(includeLocation: true);

            var query = _repository.Data.Where(x => x.CategoryId == data.CategoryId && x.Status == AnnouncementStatus.Active);

            if (data.Gender == UserGender.Male)
            {
                query = query.Where(x => x.User.Gender == UserGender.Male);
            }
            else if (data.Gender == UserGender.Female)
            {
                query = query.Where(x => x.User.Gender == UserGender.Female);
            }

            if (data.ExperienceLevel != null)
            {
                query = query.Where(x => x.ExperienceLevel == data.ExperienceLevel);
            }

            if (currentUser != null)
            {
                query = query.Where(x => x.UserId != currentUser.Id);
            }

            var queryResult = await query
                .Select(x => new AnnouncementResultListItem()
                {
                    AnnouncementId = x.Id,
                    AnnouncementCreatedAt = x.CreatedAt,
                    AnnouncementExperienceLevel = x.ExperienceLevel,
                    UserId = x.UserId,
                    Description = x.Description,
                    User = _extendedMapper.ToUserDTO(x.User),
                    UserAge = UserUtils.CalculateAge(x.User.BirthDate),
                    DistanceFromCurrentUser = currentUser != null ? LocationUtils.GetDistanceFromLatLonInKm(x.User.Location, currentUser.Location!) : null
                })
                .ToListAsync();

            var result = queryResult
                .Where(x => x.UserAge >= data.AgeRange[0] && x.UserAge <= data.AgeRange[1])
                .Where(x => currentUser == null || x.DistanceFromCurrentUser <= data.DistanceMax);
            if (data.SortBy == SortOption.Newest)
            {
                result = result.OrderByDescending(x => x.AnnouncementCreatedAt);
            }
            else if (data.SortBy == SortOption.Oldest)
            {
                result = result.OrderBy(x => x.AnnouncementCreatedAt);
            }
            else if (data.SortBy == SortOption.DistanceMin)
            {
                result = result.OrderBy(x => x.DistanceFromCurrentUser);
            }
            else
            {
                result = result.OrderByDescending(x => x.DistanceFromCurrentUser);
            }

            if (currentUser != null)
            {
                await _services.ObservedSearch.MarkObservedSearchAsChecked(data);
            }

            return new PaginatedData<AnnouncementResultListItem>()
            {
                Data = result.Skip(data.Skip).Take(data.Take),
                TotalCount = data.Skip == 0 ? result.Count() : null
            };
        }
    }
}
