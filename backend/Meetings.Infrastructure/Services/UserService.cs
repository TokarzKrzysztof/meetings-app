﻿using Meetings.Database.Repositories;
using Meetings.Models.Entities;
using Meetings.Utils;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Meetings.Authentication.Services;
using Meetings.Models.Resources;
using Meetings.Infrastructure.Validators;
using Meetings.EmailSender;
using Meetings.EmailTemplates.Views;
using System.Text.Json;
using Meetings.Models.TempDataModels;
using Meetings.Infrastructure.Utils;
using Meetings.Infrastructure.Mappers;
using Meetings.FileManager;

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
        private readonly ExtendedMapper _extendedMapper;
        public UserService(IRepository<User> repository, IMapper mapper, IRepository<TempData> tempDataRepository, IHttpContextAccessor httpContextAccessor, IClaimsReader claimsReader, UserValidator userValidator, IEmailSender emailSender, ExtendedMapper extendedMapper)
        {
            _repository = repository;
            _mapper = mapper;
            _tempDataRepository = tempDataRepository;
            _httpContextAccessor = httpContextAccessor;
            _claimsReader = claimsReader;
            _userValidator = userValidator;
            _emailSender = emailSender;
            _extendedMapper = extendedMapper;
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
            return _extendedMapper.ToUserDTO(user, await GetConnectedProfileImage(id));     
        }

        public Task<bool> IsEmailTaken(string email)
        {
            return _repository.Data.AnyAsync(x => x.Email == email);
        }

        public async Task UploadProfileImage(IFormFile image)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            await FileUtils.Save(GetProfileImageFilePath(userId), image);
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

        public async Task SendUserActivityTick()
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            await _repository.Data
               .Where(x => x.Id == userId)
               .ExecuteUpdateAsync(s =>
                    s.SetProperty(x => x.LastActiveDate, DateTime.UtcNow)
                );
        }

        private async Task<string?> GetConnectedProfileImage(Guid userId)
        {
            var filePath = GetProfileImageFilePath(userId);
            return await FileUtils.GetImageBase64(filePath);
        }
        private string GetProfileImageFilePath(Guid userId)
        {
            return Path.Combine(FileUtils.Root, $"profile image - {userId}.jpg");
        }
    }
}
