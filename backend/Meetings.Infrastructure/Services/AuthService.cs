﻿using AutoMapper;
using FluentValidation;
using Meetings.Authentication.Services;
using Meetings.Database.Repositories;
using Meetings.EmailSender;
using Meetings.EmailTemplates.Views;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Meetings.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Services
{
    public class AuthService
    {
        private readonly ITokenGenerator _tokenGenerator;
        private readonly IRepository<User> _repository;
        private readonly IRepository<TempData> _tempDataRepository;
        private readonly IMapper _mapper;
        private readonly IEmailSender _emailSender;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserService _userService;
        private readonly UserValidator _userValidator;
        public AuthService(ITokenGenerator tokenGenerator, IRepository<User> repository, IMapper mapper, IEmailSender emailSender, IRepository<TempData> tempDataRepository, IHttpContextAccessor httpContextAccessor, UserService userService, UserValidator userValidator)
        {
            _tokenGenerator = tokenGenerator;
            _repository = repository;
            _mapper = mapper;
            _emailSender = emailSender;
            _tempDataRepository = tempDataRepository;
            _httpContextAccessor = httpContextAccessor;
            _userService = userService;
            _userValidator = userValidator;
        }

        public async Task<UserDTO> Login(LoginCredentials data, string appUrl)
        {
            var user = await TryGetUserByEmail(data.Email);
            if (user == null || !UserRuleBuilderExtensions.BeCorrect(data.Password, user))
            {
                throw new UnauthorizedAccessException();
            }
            if (!user.IsActive)
            {
                ResendActivationLink(user.Email, appUrl);
                throw new UnauthorizedAccessException("UserNotActive");
            }

            var token = _tokenGenerator.GenerateToken(user);
            UpdateAuthCookie(token, DateTime.UtcNow.AddDays(7));

            return await _userService.GetUser(user.Id);
        }

        public async Task Logout()
        {
            UpdateAuthCookie("", DateTime.UtcNow.AddDays(-1));
        }

        public async Task Register(UserDTO data, string appUrl)
        {
            await _userValidator.WhenRegister(data);

            data.Password = Hasher.Hash(data.Password);

            var user = await _repository.Create(_mapper.Map(data, new User()));
            var tempData = await _tempDataRepository.Create(new TempData(user.Id.ToString()));

            if (Utilities.IsDebug())
            {
                user.IsActive = true;
            }
            else
            {
                SendUserActivationLink(user, appUrl, tempData);
            }
        }

        public async Task ResendActivationLink(string email, string appUrl)
        {
            var user = await _repository.Data.SingleAsync(x => x.Email == email);
            var tempData = await _tempDataRepository.Data.SingleAsync(x => x.Data == user.Id.ToString());

            SendUserActivationLink(user, appUrl, tempData);
        }

        public async Task ResetPassword(ResetPasswordData data)
        {
            await _userValidator.WhenResetPassword(data);

            var tempData = await _tempDataRepository.GetById(data.TempId);
            var user = await _repository.Data.SingleAsync(x => x.Email == tempData.Data);

            user.Password = Hasher.Hash(data.NewPassword);
            await _repository.Update(user);
        }

        public async Task SendForgotPasswordEmail(string email, string appUrl)
        {
            var tempData = await _tempDataRepository.Create(new TempData(email));
            EmailData emailData = new EmailData(
               new EmailReceiver(email, email),
               "Reset hasła",
               "ResetPassword",
               new ResetPasswordModel($"{appUrl}/api/Email/ResetPassword?tempId={tempData.Id}")
           );

            // non blocking action
            _emailSender.Send(emailData);
        }

        public async Task<User> TryGetUserByEmail(string email)
        {
            return await _repository.Data.SingleOrDefaultAsync(x => x.Email == email);
        }

        private void SendUserActivationLink(User user, string appUrl, TempData tempData)
        {
            EmailData emailData = new EmailData(
                new EmailReceiver(user.Email, $"{user.FirstName} {user.LastName}"),
                "Aktywacja konta",
                "ConfirmAccount",
                new ConfirmAccountModel(user.FirstName, $"{appUrl}/api/Email/ConfirmAccount?tempId={tempData.Id}")
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
