using AutoMapper;
using Meetings.Authentication.Services;
using Meetings.Database.QueryExtensions;
using Meetings.Database.Repositories;
using Meetings.FileManager;
using Meetings.Infrastructure.Mappers;
using Meetings.Infrastructure.Utils;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Meetings.Models.Resources.Pagination;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Meetings.Infrastructure.Services
{
    public class AnnouncementService
    {
        private readonly IRepository<Announcement> _repository;
        private readonly IMapper _mapper;
        private readonly IClaimsReader _claimsReader;
        private readonly AnnouncementValidator _announcementValidator;
        private readonly IFileManager _fileManager;
        private readonly ExtendedMapper _extendedMapper;
        private readonly UserService _userService;
        public AnnouncementService(IRepository<Announcement> repository, IMapper mapper, IClaimsReader claimsReader, AnnouncementValidator announcementValidator, IFileManager fileManager, ExtendedMapper extendedMapper, UserService userService)
        {
            _repository = repository;
            _mapper = mapper;
            _claimsReader = claimsReader;
            _announcementValidator = announcementValidator;
            _fileManager = fileManager;
            _extendedMapper = extendedMapper;
            _userService = userService;
        }

        public async Task CreateNewAnnouncement(AnnouncementDTO data)
        {
            await _announcementValidator.WhenCreateNewAnnouncement(data);

            data.UserId = _claimsReader.GetCurrentUserId();
            data.Status = Utilities.Utils.IsDebug() ? AnnouncementStatus.Active : AnnouncementStatus.Pending;

            var newAnnouncement = _mapper.Map<Announcement>(data);
            await _repository.Create(newAnnouncement);
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
            await _announcementValidator.WhenSetAnnouncementStatus(id);

            await _repository.Data
               .Where(x => x.Id == id)
               .ExecuteUpdateAsync(s =>
                    s.SetProperty(x => x.Status, newStatus)
                );
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

        public async Task<PaginatedData<AnnouncementResultListItem>> GetAnnouncementResultList(GetAnnouncementResultListData data)
        {
            _announcementValidator.WhenGetAnnouncementResultList(data);

            var currentUser = await _userService.TryGetCurrentUser(includeLocation: true);

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
                    DistanceFromCurrentUser = currentUser != null ? LocationUtils.GetDistanceFromLatLonInKm(x.User.Location, currentUser.Location) : null
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

            return new PaginatedData<AnnouncementResultListItem>()
            {
                Data = result.Skip(data.Skip).Take(data.Take),
                TotalCount = data.Skip == 0 ? result.Count() : null
            };
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
    }
}
