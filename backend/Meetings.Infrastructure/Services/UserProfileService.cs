using AutoMapper;
using Meetings.Authentication.Services;
using Meetings.Database.Repositories;
using Meetings.FileManager;
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
        public UserProfileService(IClaimsReader claimsReader, IFileManager fileManager, IRepository<UserProfile> repository, IMapper mapper)
        {
            _claimsReader = claimsReader;
            _fileManager = fileManager;
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<UserProfile> GetCurrentUserProfile()
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            return await _repository.Data.SingleAsync(x => x.UserId == userId);
        }

        public async Task EditDescription(string? description)
        {
            var userProfile = await GetCurrentUserProfile();
            userProfile.Description = !string.IsNullOrWhiteSpace(description) ? description : null;

            await _repository.Update(userProfile);
        }

        public async Task UploadProfileImage(IFormFile image)
        {
            var filePath = Path.Combine(_fileManager.Root, "ProfileImages", $"{Guid.NewGuid()}.jpg");
            await _fileManager.Save(filePath, image);

            var userProfile = await GetCurrentUserProfile();
            SetImagePath(userProfile, filePath);

            await _repository.Update(userProfile);
        }

        public async Task EditInterests(string[] interests)
        {
            var availableInterests = GetAvailableInterests();
            // TODO move to validator class
            if (interests.Any(x => !availableInterests.Contains(x)))
            {
                throw new Exception("available interests not match");
            }

            var userProfile = await GetCurrentUserProfile();
            userProfile.Interests = interests;

            await _repository.Update(userProfile);
        }

        public string[] GetAvailableInterests()
        {
            return UserProfileUtils.Interests;
        }

        public async Task<UserProfileDTO> GetUserProfile(Guid userId)
        {
            var userProfile = await _repository.Data.Include(x => x.User).SingleAsync(x => x.UserId == userId);
            return _mapper.Map<UserProfileDTO>(userProfile);
        }

        public async Task RemoveUserProfile(Guid userId)
        {
            var userProfile = await _repository.Data.SingleAsync(x => x.UserId == userId);
            SetImagePath(userProfile, null);

            await _repository.Remove(userProfile);
        }

        private void SetImagePath(UserProfile userProfile, string? newFilePath)
        {
            if (userProfile.ImagePath != null)
            {
                _fileManager.Delete(userProfile.ImagePath);
            }
            userProfile.ImagePath = newFilePath;
        }
    }
}
