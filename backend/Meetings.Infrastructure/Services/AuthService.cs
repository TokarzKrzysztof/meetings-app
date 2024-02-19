using AutoMapper;
using FluentValidation;
using Meetings.Authentication.Services;
using Meetings.Database.Repositories;
using Meetings.EmailSender;
using Meetings.EmailTemplates.Views;
using Meetings.Infrastructure.Helpers;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Meetings.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Meetings.Utilities.Extensions;
using Meetings.Models.TempDataModels;
using System.Text.Json;

namespace Meetings.Infrastructure.Services
{
    public class AuthService
    {
        private readonly UserRepository _repository;
        private readonly ITokenGenerator _tokenGenerator;
        private readonly IMapper _mapper;
        private readonly IEmailSender _emailSender;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserValidator _userValidator;
        private readonly IClaimsReader _claimsReader;
        private readonly IServices _services;
        public AuthService(ITokenGenerator tokenGenerator,
                           UserRepository repository,
                           IMapper mapper,
                           IEmailSender emailSender,
                           IHttpContextAccessor httpContextAccessor,
                           UserValidator userValidator,
                           IClaimsReader claimsReader,
                           IServices services)
        {
            _tokenGenerator = tokenGenerator;
            _repository = repository;
            _mapper = mapper;
            _emailSender = emailSender;
            _httpContextAccessor = httpContextAccessor;
            _userValidator = userValidator;
            _claimsReader = claimsReader;
            _services = services;
        }

        public async Task<UserDTO> Login(LoginCredentials data)
        {
            var user = await TryGetUserByEmail(data.Email);
            if (user == null || !UserRuleBuilderExtensions.BeCorrect(data.Password, user))
            {
                throw new UnauthorizedAccessException();
            }
            if (!user.IsConfirmed)
            {
                ResendActivationLink(user.Email);
                throw new UnauthorizedAccessException("UserNotActive");
            }

            var token = _tokenGenerator.GenerateToken(user);
            UpdateAuthCookie(token, DateTime.UtcNow.AddDays(7));

            return await _services.User.GetUser(user.Id);
        }

        public async Task Logout()
        {
            // TODO remember to call it when removing user
            UpdateAuthCookie("", DateTime.UtcNow.AddDays(-1));
        }

        public async Task Register(RegisterData data)
        {
            await _userValidator.WhenRegister(data);

            data.Password = Hasher.Hash(data.Password);

            var user = await _repository.CreateUserWithProfile(_mapper.Map(data, new User()));
            var tempData = await _services.TempData.Create(RegisterTempData.ToTemp(data.RedirectUrl, user.Id));

            SendUserActivationLink(user, tempData.Id);
        }

        public async Task ResendActivationLink(string email)
        {
            var user = await _repository.Data.SingleAsync(x => x.Email == email);
            var tempData = await _services.TempData.Get(x => x.Data2 == user.Id.ToString());

            SendUserActivationLink(user, tempData.Id);
        }

        public async Task ResetPassword(ResetPasswordData data)
        {
            await _userValidator.WhenResetPassword(data);

            var tempData = await _services.TempData.Get(data.TempId);

            string email = ForgotPasswordTempData.FromTemp(tempData).Email;
            await _repository.Data
                .Where(x => x.Email == email)
                .ExecuteUpdateAsync(s =>
                     s.SetProperty(x => x.Password, Hasher.Hash(data.NewPassword))
                 );
        }

        public async Task SendForgotPasswordEmail(string email)
        {
            var tempData = await _services.TempData.Create(ForgotPasswordTempData.ToTemp(email));

            EmailData emailData = new EmailData(
               new EmailReceiver(email, email),
               "Reset hasła",
               "ResetPassword",
               new ResetPasswordModel($"{_httpContextAccessor.GetAppUrl()}/api/Email/ResetPassword?tempId={tempData.Id}")
           );

            // non blocking action
            _emailSender.Send(emailData);
        }

        public async Task<User> TryGetUserByEmail(string email)
        {
            return await _repository.Data.SingleOrDefaultAsync(x => x.Email == email);
        }

        public async Task RemoveAccount()
        {
            await Logout();

            Guid userId = _claimsReader.GetCurrentUserId();

            await _services.Announcement.RemoveAllUserAnnouncements(userId);
            await _services.ChatParticipant.RemoveUserFromAllGroupChats(userId);
            await _services.UserProfile.RemoveUserProfile(userId);
            await _repository.Remove(userId);
        }

        private void SendUserActivationLink(User user, Guid tempId)
        {
            EmailData emailData = new EmailData(
                new EmailReceiver(user.Email, $"{user.FirstName} {user.LastName}"),
                "Aktywacja konta",
                "ConfirmAccount",
                new ConfirmAccountModel(user.FirstName, $"{_httpContextAccessor.GetAppUrl()}/api/Email/ConfirmAccount?tempId={tempId}")
            );

            // non blocking action
            _emailSender.Send(emailData);
        }

        private void UpdateAuthCookie(string token, DateTime expires)
        {
            _httpContextAccessor.HttpContext.Response.Cookies.Append(CookieList.AccessToken, token, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.None, Secure = true, Expires = expires });
        }
    }
}
