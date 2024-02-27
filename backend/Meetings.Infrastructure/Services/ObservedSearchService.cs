using AutoMapper;
using Meetings.Authentication.Services;
using Meetings.Database.Repositories;
using Meetings.EmailSender;
using Meetings.EmailTemplates.Views;
using Meetings.Infrastructure.Helpers;
using Meetings.Infrastructure.Utils;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Meetings.Utilities.Extensions;
using Microsoft.AspNetCore.Http.HttpResults;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Meetings.Models.Resources.Pagination;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using Meetings.Infrastructure.Mappers;

namespace Meetings.Infrastructure.Services
{
    public class ObservedSearchService
    {
        private readonly IRepository<ObservedSearch> _repository;
        private readonly IClaimsReader _claimsReader;
        private readonly ObservedSearchValidator _observedSearchValidator;
        private readonly IMapper _mapper;
        private readonly IServices _services;
        private readonly IEmailSender _emailSender;
        private readonly ExtendedMapper _extendedMapper;

        public ObservedSearchService(IRepository<ObservedSearch> repository, IClaimsReader claimsReader, ObservedSearchValidator observedSearchValidator, IMapper mapper, IServices services, IEmailSender emailSender, ExtendedMapper extendedMapper)
        {
            _repository = repository;
            _claimsReader = claimsReader;
            _observedSearchValidator = observedSearchValidator;
            _mapper = mapper;
            _services = services;
            _emailSender = emailSender;
            _extendedMapper = extendedMapper;
        }

        private async Task<ObservedSearch?> TryGetObservedSearchEntityByFilters(ResultListFilters data)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            return await _repository.Data.SingleOrDefaultAsync(x =>
                                     x.UserId == userId &&
                                     x.CategoryId == data.CategoryId &&
                                     x.DistanceMax == data.DistanceMax &&
                                     x.AgeRange == data.AgeRange &&
                                     x.Gender == data.Gender &&
                                     x.ExperienceLevel == data.ExperienceLevel
                                   );
        }

        public async Task<ObservedSearchDTO?> TryGetObservedSearchByFilters(ResultListFilters data)
        {
            var result = await TryGetObservedSearchEntityByFilters(data);
            return _mapper.Map<ObservedSearchDTO?>(result);
        }

        public async Task AddObservedSearch(ObservedSearchDTO data)
        {
            bool isObserved = (await TryGetObservedSearchEntityByFilters(data)) != null;
            await _observedSearchValidator.WhenAddObservedSearch(data, isObserved);

            ObservedSearch entity = _mapper.Map<ObservedSearch>(data);
            entity.UserId = _claimsReader.GetCurrentUserId();

            await _repository.Create(entity);
        }

        public async Task AfterAnnouncementActivated(Announcement announcement)
        {
            User creator = await _services.User.GetUserEntity(announcement.UserId, includeLocation: true);

            int userAge = UserUtils.CalculateAge(creator.BirthDate);
            var matchedFilters = await _repository.Data.Where(x =>
                            x.UserId != creator.Id &&
                            x.CategoryId == announcement.CategoryId &&
                            (userAge >= x.AgeRange[0] && userAge <= x.AgeRange[1]) &&
                            (x.Gender == null || x.Gender == creator.Gender) &&
                            (x.ExperienceLevel == null || x.ExperienceLevel == announcement.ExperienceLevel)
                          )
                     .Include(x => x.User).ThenInclude(x => x.Location)
                     .ToListAsync();
            matchedFilters = matchedFilters
                .Where(x => LocationUtils.GetDistanceFromLatLonInKm(x.User.Location, creator.Location) <= x.DistanceMax).ToList();

            foreach (ObservedSearch item in matchedFilters)
            {
                item.NewAnnouncementsCount++;
                item.ShouldSendEmail = true;
            }
            await _repository.UpdateRange(matchedFilters);
        }

        public async Task<PaginatedData<ObservedSearchDTO>> GetCurrentUserObservedSearches(GetCurrentUserObservedSearchesData data)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            var query = _repository.Data.Where(x => x.UserId == userId).Include(x => x.Category);
            List<ObservedSearch> result = await query.OrderByDescending(x => x.CreatedAt).Skip(data.Skip).Take(data.Take).ToListAsync();

            return new PaginatedData<ObservedSearchDTO>
            {
                Data = _mapper.Map<List<ObservedSearchDTO>>(result),
                TotalCount = data.Skip == 0 ? await query.CountAsync() : null
            };
        }

        public async Task NotifyAboutNewAnnouncementsByEmail()
        {
            var filtersWithNewAnnouncements = await _repository.Data
                     .Include(x => x.User).Include(x => x.Category)
                     .Where(x => x.NewAnnouncementsCount > 0 && x.IsEmailNotificationEnabled && x.ShouldSendEmail)
                     .ToListAsync();

            foreach (ObservedSearch item in filtersWithNewAnnouncements)
            {
                EmailData emailData = new EmailData(
                   new EmailReceiver(item.User.Email, item.User.Email),
                   "Powiadomienie o nowych ogłoszeniach",
                   "NewAnnouncementNotification",
                   new NewAnnouncementNotificationModel(item.ResultListUrl, item.NewAnnouncementsCount, item.Category.Name)
               );
                item.ShouldSendEmail = false;

                // TODO check error handling
                // non blocking action
                _emailSender.Send(emailData);
            }
            await _repository.UpdateRange(filtersWithNewAnnouncements);
        }

        public async Task RemoveObservedSearch(Guid id)
        {
            await _observedSearchValidator.WhenRemoveObservedSearch(id);
            await _repository.Remove(id);
        }

        public async Task MarkObservedSearchAsChecked(ResultListFilters filters)
        {
            ObservedSearch? item = await TryGetObservedSearchEntityByFilters(filters);
            if (item != null)
            {
                item.NewAnnouncementsCount = 0;
                item.ShouldSendEmail = false;
                await _repository.Update(item);
            }
        }

        public async Task ToggleEmailNotification(Guid id)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            await _repository.Data.Where(x => x.Id == id && x.UserId == userId)
               .ExecuteUpdateAsync(s =>
                   s.SetProperty(x => x.IsEmailNotificationEnabled, x => !x.IsEmailNotificationEnabled)
                );
        }
    }
}