using AutoMapper;
using Meetings.Authentication.Services;
using Meetings.Database.Repositories;
using Meetings.FileManager;
using Meetings.Infrastructure.Helpers;
using Meetings.Infrastructure.Mappers;
using Meetings.Infrastructure.Utils;
using Meetings.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Services
{
    public class UserProfileService
    {
        private readonly IClaimsReader _claimsReader;
        private readonly IFileManager _fileManager;
        private readonly IRepository<UserProfile> _repository;
        private readonly IMapper _mapper;
        private readonly IServices _services;
        private readonly ExtendedMapper _extendedMapper;
        public UserProfileService(IClaimsReader claimsReader, IFileManager fileManager, IRepository<UserProfile> repository, IMapper mapper, IServices services, ExtendedMapper extendedMapper)
        {
            _claimsReader = claimsReader;
            _fileManager = fileManager;
            _repository = repository;
            _mapper = mapper;
            _services = services;
            _extendedMapper = extendedMapper;
        }

        public async Task<UserProfile> GetCurrentUserProfile()
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            return await _repository.Data.SingleAsync(x => x.UserId == userId);
        }

        public async Task EditDescription(string? description)
        {
            var userProfile = await GetCurrentUserProfile();
            userProfile.Description = !string.IsNullOrWhiteSpace(description) ? description.Trim() : null;

            await _repository.Update(userProfile);
        }

        public async Task EditInterests(Guid[] data)
        {
            var userProfile = await GetCurrentUserProfile();
            // to preserve order of interests
            userProfile.InterestsIds = GetAvailableInterests().Where(x => data.Contains(x.Id)).Select(x => x.Id).ToList();

            await _repository.Update(userProfile);
        }

        public List<Interest> GetAvailableInterests()
        {
            return UserProfileUtils.Interests;
        }

        public async Task<UserProfileDTO> GetUserProfile(Guid userId)
        {
            UserProfile userProfile = await _repository.Data.Include(x => x.User).SingleAsync(x => x.UserId == userId);
            return _extendedMapper.ToUserProfileDTO(userProfile);
        }

        public async Task RemoveUserProfile(Guid userId)
        {
            var userProfile = await _repository.Data.Include(x => x.User).SingleAsync(x => x.UserId == userId);
            _services.User.SetProfileImagePath(userProfile.User, null);

            await _repository.Remove(userProfile);
        }
    }
}
