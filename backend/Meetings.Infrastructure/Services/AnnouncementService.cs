using AutoMapper;
using Meetings.Authentication;
using Meetings.Authentication.Services;
using Meetings.Database.Repositories;
using Meetings.EmailSender;
using Meetings.FileManager;
using Meetings.Infrastructure.Mappers;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Meetings.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
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
        public AnnouncementService(IRepository<Announcement> repository, IMapper mapper, IClaimsReader claimsReader, AnnouncementValidator announcementValidator, IFileManager fileManager, ExtendedMapper extendedMapper)
        {
            _repository = repository;
            _mapper = mapper;
            _claimsReader = claimsReader;
            _announcementValidator = announcementValidator;
            _fileManager = fileManager;
            _extendedMapper = extendedMapper;
        }

        public async Task CreateNewAnnouncement(AnnouncementDTO data)
        {
            _announcementValidator.WhenCreateNewAnnouncement(data);

            data.UserId = _claimsReader.GetCurrentUserId();
            data.Status = Utilities.IsDebug() ? AnnoucementStatus.Active : AnnoucementStatus.Pending;

            var newAnnouncement = _mapper.Map<Announcement>(data);
            await _repository.Create(newAnnouncement);
        }


        public async Task EditAnnouncement(AnnouncementDTO data)
        {
            await _announcementValidator.WhenEditAnnouncement(data);

            var item = await _repository.GetById(data.Id);
            item.Description = data.Description;
            item.CategoryId = data.CategoryId;
            data.Status = Utilities.IsDebug() ? AnnoucementStatus.Active : AnnoucementStatus.Pending;

            await _repository.Update(item);
        }

        public async Task<List<AnnouncementDTO>> GetCurrentUserAnnouncements()
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            List<Announcement> data = await _repository.Data.Where(x => x.UserId == userId).ToListAsync();

            return _mapper.Map<List<AnnouncementDTO>>(data);
        }

        public async Task SetAnnouncementStatus(Guid id, AnnoucementStatus newStatus)
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

        public async Task<List<UserAnnouncement>> GetAnnouncementResultList(AnnouncementQueryParams data)
        {
            var query = _repository.Data.Where(x => x.CategoryId == data.CategoryId && x.Status == AnnoucementStatus.Active);

            Guid? userId = _claimsReader.TryGetCurrentUserId();
            if (userId != null)
            {
                query = query.Where(x => x.UserId != userId);
            }

            var dateNow = DateTime.UtcNow;
            var result = await query.Select(x => new UserAnnouncement()
            {
                AnnouncementId = x.Id,
                UserId = x.UserId,
                Description = x.Description,
                Author = _extendedMapper.ToUserDTO(x.User)
            }).ToListAsync();

            return result;
        }
    }
}
