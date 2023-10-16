using AutoMapper;
using Meetings.Authentication;
using Meetings.Database.Repositories;
using Meetings.EmailSender;
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
        private readonly IHttpContextAccessor _httpContextAccessor;
        public AnnouncementService(IRepository<Announcement> repository, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task CreateNewAnnouncement(AnnouncementDTO data)
        {
            data.UserId = GetCurrentUserId();

            var newAnnouncement = _mapper.Map<Announcement>(data);
            await _repository.Create(newAnnouncement);
        }

        public async Task<List<AnnouncementDTO>> GetCurrentUserAnnouncements()
        {
            Guid userId = GetCurrentUserId();
            var data = await _repository.Data.Where(x => x.UserId == userId).ToListAsync();

            return _mapper.Map<List<AnnouncementDTO>>(data);
        }

        private Guid GetCurrentUserId()
        {
            IEnumerable<Claim> claims = _httpContextAccessor.HttpContext.User.Claims;
            Guid userId = new Guid(claims.Single(x => x.Type == UserClaims.Id).Value);
            return userId;
        }
    }
}
