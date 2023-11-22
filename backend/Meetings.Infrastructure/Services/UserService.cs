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
using Microsoft.AspNetCore.Mvc;
using Meetings.Models.Resources;
using Meetings.Infrastructure.Validators;
using Meetings.EmailSender;
using Meetings.EmailTemplates.Views;
using System.Text.Json;
using Meetings.Models.TempDataModels;
using System.Collections.Generic;

namespace Meetings.Infrastructure.Services
{
    public class UserService
    {
        private readonly IRepository<User> _repository;
        private readonly IMapper _mapper;
        private readonly IRepository<TempData> _tempDataRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IClaimsReader _claimsReader;
        private readonly UserValidator _userValidator;
        private readonly IEmailSender _emailSender;
        public UserService(IRepository<User> repository, IMapper mapper, IRepository<TempData> tempDataRepository, IHttpContextAccessor httpContextAccessor, IClaimsReader claimsReader, UserValidator userValidator, IEmailSender emailSender)
        {
            _repository = repository;
            _mapper = mapper;
            _tempDataRepository = tempDataRepository;
            _httpContextAccessor = httpContextAccessor;
            _claimsReader = claimsReader;
            _userValidator = userValidator;
            _emailSender = emailSender;
        }

        public async Task SendChangeEmailAddressEmail(ChangeEmailAddressData data, string appUrl)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            var user = await _repository.GetById(userId);

            await _userValidator.WhenChangeEmailAddress(data, user);

            var serializedData = JsonSerializer.Serialize(new ChangeEmailAddressTempData(data.Email, userId));
            var tempData = await _tempDataRepository.Create(new TempData(serializedData));
            EmailData emailData = new EmailData(
               new EmailReceiver(data.Email, data.Email),
               "Zmiana adresu email",
               "ChangeEmailAddress",
               new ChangeEmailAddressModel($"{appUrl}/api/Email/ChangeEmailAddress?tempId={tempData.Id}")
           );

            // non blocking action
            _emailSender.Send(emailData);
        }

        public async Task ChangeEmailAddress(Guid tempId)
        {
            var tempData = await _tempDataRepository.GetById(tempId);
            var data = JsonSerializer.Deserialize<ChangeEmailAddressTempData>(tempData.Data);

            var user = await _repository.GetById(data.UserId);
            user.Email = data.Email;

            await _repository.Update(user);
            await _tempDataRepository.RemovePermanently(tempData);
        }

        public async Task ChangePassword(ChangePasswordData data)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            var user = await _repository.GetById(userId);

            await _userValidator.WhenChangePassword(data, user);

            user.Password = Hasher.Hash(data.NewPassword);
            await _repository.Update(user);
        }

        public async Task<UserDTO> ChangePersonalData(UserDTO data)
        {
            await _userValidator.WhenChangePersonalData(data);

            Guid userId = _claimsReader.GetCurrentUserId();
            var user = await _repository.GetById(userId);

            user.FirstName = data.FirstName;
            user.LastName = data.LastName;
            user.Gender = data.Gender;
            user.BirthDate = data.BirthDate;

            await _repository.Update(user);

            return await GetUser(userId);
        }

        public async Task ConfirmAccount(Guid tempId)
        {
            var tempData = await _tempDataRepository.GetById(tempId);
            var user = await _repository.GetById(new Guid(tempData.Data));

            user.IsConfirmed = true;

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

            return await GetUser((Guid)userId);
        }

        public async Task<UserDTO> GetUser(Guid id)
        {
            var user = await _repository.GetById(id);

            var result = _mapper.Map<UserDTO>(user);
            result.ProfileImage = await GetConnectedProfileImage(id);
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

        private async Task<string> GetConnectedProfileImage(Guid userId)
        {
            var filePath = GetProfileImageFilePath(userId);

            if (!File.Exists(filePath)) return null;

            byte[] bytes = await File.ReadAllBytesAsync(filePath);
            return $"data:image/jpeg;base64, {Convert.ToBase64String(bytes)}";
        }
        private string GetProfileImageFilePath(Guid userId)
        {
            return Path.Combine(Directory.GetCurrentDirectory(), "Files", $"profile image - {userId}.jpg");
        }

        public async Task<List<UserDTO>> GetProfileImages(Guid[] userIds)
        {
            List<UserDTO> result = new List<UserDTO>();
            foreach (var id in userIds)
            {
                result.Add(new UserDTO()
                {
                    Id = id,
                    ProfileImage = await GetConnectedProfileImage(id)
                });
            }
            return result;
        }
    }
}
