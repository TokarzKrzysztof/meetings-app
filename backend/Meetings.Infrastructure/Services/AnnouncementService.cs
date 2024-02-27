using AutoMapper;
using Meetings.Authentication.Services;
using Meetings.Database.QueryExtensions;
using Meetings.Database.Repositories;
using Meetings.Infrastructure.Helpers;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Meetings.Models.Resources.Pagination;
using Microsoft.EntityFrameworkCore;

namespace Meetings.Infrastructure.Services
{
    public class AnnouncementService
    {
        private readonly IRepository<Announcement> _repository;
        private readonly IMapper _mapper;
        private readonly IClaimsReader _claimsReader;
        private readonly AnnouncementValidator _announcementValidator;
        private readonly IServices _services;

        public AnnouncementService(IRepository<Announcement> repository, IMapper mapper, IClaimsReader claimsReader, AnnouncementValidator announcementValidator, IServices services)
        {
            _repository = repository;
            _mapper = mapper;
            _claimsReader = claimsReader;
            _announcementValidator = announcementValidator;
            _services = services;
        }

        public async Task CreateNewAnnouncement(AnnouncementDTO data)
        {
            await _announcementValidator.WhenCreateNewAnnouncement(data);

            data.UserId = _claimsReader.GetCurrentUserId();
            data.Status = Utilities.Utils.IsDebug() ? AnnouncementStatus.Active : AnnouncementStatus.Pending;

            var newAnnouncement = _mapper.Map<Announcement>(data);
            await _repository.Create(newAnnouncement);

            if (Utilities.Utils.IsDebug())
            {
                await ConfirmAnnouncement(newAnnouncement);
            }
        }

        public async Task EditAnnouncement(AnnouncementDTO data)
        {
            await _announcementValidator.WhenEditAnnouncement(data);

            var item = await _repository.GetById(data.Id);
            item.Description = data.Description;
            data.Status = Utilities.Utils.IsDebug() ? AnnouncementStatus.Active : AnnouncementStatus.Pending;
            item.ExperienceLevel = data.ExperienceLevel;

            await _repository.Update(item);
        }

        public async Task<PaginatedData<AnnouncementDTO>> GetCurrentUserAnnouncements(GetCurrentUserAnnouncementsData data)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            var query = _repository.Data.Where(x => x.UserId == userId && x.Status == data.Status);
            if (!string.IsNullOrWhiteSpace(data.Filter))
            {
                string filterLower = data.Filter.ToLower();
                query = query.Where(x => x.Category.Name.ToLower().Contains(filterLower) || x.Description.ToLower().Contains(filterLower));
            }

            List<Announcement> result = await query.OrderByDescending(x => x.UpdatedAt).Skip(data.Skip).Take(data.Take).ToListAsync();
            return new PaginatedData<AnnouncementDTO>()
            {
                Data = _mapper.Map<List<AnnouncementDTO>>(result),
                TotalCount = data.Skip == 0 ? await query.CountAsync() : null
            };
        }

        public async Task<List<Guid>> GetCurrentUserOccupiedCategoryIds()
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            return await _repository.Data
                .GetActivelyOccupiedByUser(userId)
                .Select(x => x.CategoryId)
                .ToListAsync();
        }

        public async Task SetAnnouncementStatus(Guid id, AnnouncementStatus newStatus)
        {
            await _announcementValidator.WhenSetAnnouncementStatus(id, newStatus);

            await _repository.Data
               .Where(x => x.Id == id)
               .ExecuteUpdateAsync(s =>
                    s.SetProperty(x => x.Status, newStatus)
                );
        }

        public async Task ConfirmAnnouncement(Announcement announcement)
        {
            await _repository.Data
               .Where(x => x.Id == announcement.Id)
               .ExecuteUpdateAsync(s =>
                    s.SetProperty(x => x.Status, AnnouncementStatus.Active)
                );

            await _services.ObservedSearch.AfterAnnouncementActivated(announcement);
        }

        public async Task RemoveAnnouncement(Guid id)
        {
            await _announcementValidator.WhenRemoveAnnouncement(id);
            await _repository.Remove(id);
        }

        public async Task<AnnouncementDTO> GetAnnouncement(Guid id)
        {
            var item = await _repository.GetById(id);
            return _mapper.Map<AnnouncementDTO>(item);
        }

        public async Task<AnnouncementsCount> GetCurrentUserAnnouncementsCount()
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            var statuses = await _repository.Data.Where(x => x.UserId == userId).Select(x => x.Status).ToListAsync();
            return new AnnouncementsCount()
            {
                Active = statuses.Count(x => x == AnnouncementStatus.Active),
                Pending = statuses.Count(x => x == AnnouncementStatus.Pending),
                Closed = statuses.Count(x => x == AnnouncementStatus.Closed),
            };
        }

        public async Task RemoveAllUserAnnouncements(Guid userId)
        {
            List<Announcement> announcements = await _repository.Data.Where(x => x.UserId == userId).ToListAsync();
            await _repository.RemoveRange(announcements);
        }
    }
}
