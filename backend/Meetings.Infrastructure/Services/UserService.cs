using Meetings.Database.Repositories;
using Meetings.Models.Entities;
using Meetings.Utilities;
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
using Meetings.Infrastructure.Helpers;
using Meetings.Utilities.Extensions;

namespace Meetings.Infrastructure.Services
{
    public class UserService
    {
        private readonly IRepository<User> _repository;
        private readonly IMapper _mapper;
        private readonly IRepository<TempData> _tempDataRepository;
        private readonly IClaimsReader _claimsReader;
        private readonly UserValidator _userValidator;
        private readonly IEmailSender _emailSender;
        private readonly ExtendedMapper _extendedMapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IFileManager _fileManager;
        private readonly IRepository<BlockedUser> _blockedUserRepository;

        public UserService(IRepository<User> repository,
                           IMapper mapper,
                           IRepository<TempData> tempDataRepository,
                           IClaimsReader claimsReader,
                           UserValidator userValidator,
                           IEmailSender emailSender,
                           ExtendedMapper extendedMapper,
                           IHttpContextAccessor httpContextAccessor,
                           IFileManager fileManager,
                           IRepository<BlockedUser> blockedUserRepository)
        {
            _repository = repository;
            _mapper = mapper;
            _tempDataRepository = tempDataRepository;
            _claimsReader = claimsReader;
            _userValidator = userValidator;
            _emailSender = emailSender;
            _extendedMapper = extendedMapper;
            _httpContextAccessor = httpContextAccessor;
            _fileManager = fileManager;
            _blockedUserRepository = blockedUserRepository;
        }

        public async Task SendChangeEmailAddressEmail(ChangeEmailAddressData data)
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
               new ChangeEmailAddressModel($"{_httpContextAccessor.GetAppUrl()}/api/Email/ChangeEmailAddress?tempId={tempData.Id}")
           );

            // non blocking action
            _emailSender.Send(emailData);
        }

        public async Task ChangeEmailAddress(Guid tempId)
        {
            var tempData = await _tempDataRepository.GetById(tempId);
            var data = JsonSerializer.Deserialize<ChangeEmailAddressTempData>(tempData.Data);

            await _repository.Data
                .Where(x => x.Id == data.UserId)
                .ExecuteUpdateAsync(s =>
                    s.SetProperty(x => x.Email, data.Email)
                 );
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

            await _repository.Data
                .Where(x => x.Id == userId)
                .ExecuteUpdateAsync(s =>
                    s.SetProperty(x => x.FirstName, data.FirstName)
                     .SetProperty(x => x.LastName, data.LastName)
                     .SetProperty(x => x.Gender, data.Gender)
                     .SetProperty(x => x.BirthDate, data.BirthDate)
                     .SetProperty(x => x.LocationId, data.LocationId)
                 );

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

        public async Task<UserDTO> TryGetCurrentUser(bool includeLocation = false)
        {
            Guid? userId = _claimsReader.TryGetCurrentUserId();
            if (userId == null)
            {
                return null;
            }

            return await GetUser((Guid)userId, includeLocation);
        }

        public async Task<UserDTO> GetUser(Guid id, bool includeLocation = false)
        {
            var user = await _repository.GetById(id, includeLocation ? q => q.Include(x => x.Location) : null);
            return _extendedMapper.ToUserDTO(user);
        }

        public async Task<List<UserDTO>> GetUsersByFilter(string filter, int take, bool excludeCurrentUser)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            string filterLower = filter.ToLower().Replace(" ", "");
            List<User> users = await _repository.Data
                .Where(x => (x.FirstName + x.LastName).ToLower().Contains(filterLower))
                .If(excludeCurrentUser, q => q.Where(x => x.Id != userId))
                .Take(take)
                .ToListAsync();

            return _extendedMapper.ToUserDTOList(users);
        }

        public Task<bool> IsEmailTaken(string email)
        {
            return _repository.Data.AnyAsync(x => x.Email == email);
        }

        public async Task UploadProfileImage(IFormFile image)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            var filePath = Path.Combine(_fileManager.Root, "ProfileImages", $"{Guid.NewGuid()}.jpg");
            await _fileManager.Save(filePath, image);

            var user = await _repository.GetById(userId);
            if (user.ProfileImagePath != null)
            {
                _fileManager.Delete(user.ProfileImagePath);
            }
            user.ProfileImagePath = filePath;

            await _repository.Update(user);
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

        public async Task BlockUser(Guid id)
        {
            await _userValidator.WhenBlockUser(id);

            BlockedUser item = new BlockedUser()
            {
                UserId = _claimsReader.GetCurrentUserId(),
                BlockedId = id,
            };
            await _blockedUserRepository.Create(item);
        }

        public async Task UnblockUser(Guid id)
        {
            Guid userId = _claimsReader.GetCurrentUserId();

            BlockedUser item = await _blockedUserRepository.Data.SingleAsync(x => x.UserId == userId && x.BlockedId == id);
            await _blockedUserRepository.RemovePermanently(item);
        }
    }
}
