﻿using AutoMapper;
using Meetings.Authentication;
using Meetings.Authentication.Services;
using Meetings.Database.Repositories;
using Meetings.EmailSender;
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

namespace Meetings.Infrastructure.Services
{
    public class AnnouncementService
    {
        private readonly IRepository<Announcement> _repository;
        private readonly IMapper _mapper;
        private readonly IClaimsReader _claimsReader;
        private readonly AnnouncementValidator _announcementValidator;

        public AnnouncementService(IRepository<Announcement> repository, IMapper mapper, IClaimsReader claimsReader, AnnouncementValidator announcementValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _claimsReader = claimsReader;
            _announcementValidator = announcementValidator;
        }

        public async Task CreateNewAnnouncement(AnnouncementDTO data)
        {
            _announcementValidator.WhenCreateOrEdit(data);

            data.UserId = _claimsReader.GetCurrentUserId();
#if DEBUG
            data.Status = AnnoucementStatus.Active;
#else
            data.Status = AnnoucementStatus.Pending;
#endif
            var newAnnouncement = _mapper.Map<Announcement>(data);
            await _repository.Create(newAnnouncement);
        }


        public async Task EditAnnouncement(AnnouncementDTO data)
        {
            _announcementValidator.WhenCreateOrEdit(data);

            var item = await _repository.GetById(data.Id);
            item.Description = data.Description;
            item.CategoryId = data.CategoryId;
            item.Status = AnnoucementStatus.Pending;

            await _repository.Update(item);
        }

        public async Task<List<AnnouncementDTO>> GetCurrentUserAnnouncements()
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            var data = await _repository.Data.Where(x => x.UserId == userId).ToListAsync();

            return _mapper.Map<List<AnnouncementDTO>>(data);
        }

        public async Task SetAnnouncementStatus(Guid id, AnnoucementStatus newStatus)
        {
            var item = await _repository.GetById(id);
            item.Status = newStatus;

            await _repository.Update(item);
        }

        public async Task RemoveAnnouncement(Guid id)
        {
            await _repository.Remove(id);
        }

        public async Task<AnnouncementDTO> GetAnnouncement(Guid id)
        {
            var item = await _repository.GetById(id);
            return _mapper.Map<AnnouncementDTO>(item);
        }
    }
}
