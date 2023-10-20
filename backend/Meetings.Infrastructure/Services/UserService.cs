using Meetings.Database.Repositories;
using Meetings.Models.Entities;
using Meetings.Utils;
using Meetings.Utils.Extensions;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using FluentValidation.Results;
using FluentValidation;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Meetings.Authentication;
using Meetings.Authentication.Services;

namespace Meetings.Infrastructure.Services
{
    public class UserService
    {
        private readonly IRepository<User> _repository;
        private readonly IMapper _mapper;
        private readonly IRepository<TempData> _tempDataRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IClaimsReader _claimsReader;
        public UserService(IRepository<User> repository, IMapper mapper, IRepository<TempData> tempDataRepository, IHttpContextAccessor httpContextAccessor, IClaimsReader claimsReader)
        {
            _repository = repository;
            _mapper = mapper;
            _tempDataRepository = tempDataRepository;
            _httpContextAccessor = httpContextAccessor;
            _claimsReader = claimsReader;
        }

        public async Task ConfirmAccount(Guid tempId)
        {
            var tempData = await _tempDataRepository.GetById(tempId);
            var user = await _repository.GetById(new Guid(tempData.Data));

            user.IsActive = true;

            await _repository.Update(user);
            await _tempDataRepository.RemovePermanently(tempData);
        }

        public async Task<UserDTO> GetCurrentUser()
        {
            Guid? userId = _claimsReader.TryGetCurrentUserId();
            if (userId == null)
            {
                return null;
            }

            var user = await _repository.GetById((Guid)userId);

            var result = _mapper.Map<UserDTO>(user);

            var filePath = GetProfileImageFilePath((Guid)userId);
            if (File.Exists(filePath))
            {
                byte[] bytes = await File.ReadAllBytesAsync(filePath);
                result.ProfileImage = $"data:image/jpeg;base64, {Convert.ToBase64String(bytes)}";
            }

            return result;
        }

        public Task<bool> IsEmailTaken(string email)
        {
            return _repository.Data.AnyAsync(x => x.Email == email);
        }

        public async Task UploadProfileImage(IFormFile image)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            var filePath = GetProfileImageFilePath(userId);
            using (FileStream stream = File.Create(filePath))
            {
                await image.CopyToAsync(stream);
            }
        }

        private string GetProfileImageFilePath(Guid userId)
        {
            return Path.Combine(Directory.GetCurrentDirectory(), "Files", $"profile image - {userId}.jpg");
        }
    }
}
