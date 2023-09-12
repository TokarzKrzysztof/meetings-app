using AutoMapper;
using FluentValidation;
using Meetings.Authentication;
using Meetings.Database.Repositories;
using Meetings.EmailSender;
using Meetings.EmailTemplates.Views;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Meetings.Utils;
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
        public AuthService(ITokenGenerator tokenGenerator, IRepository<User> repository, IMapper mapper, IEmailSender emailSender, IRepository<TempData> tempDataRepository)
        {
            _tokenGenerator = tokenGenerator;
            _repository = repository;
            _mapper = mapper;
            _emailSender = emailSender;
            _tempDataRepository = tempDataRepository;
        }

        public async Task<string> Login(LoginCredentials data)
        {
            var user = await TryGetUserByEmail(data.Email);
            if (user == null || !Hasher.Verify(data.Password, user.Password))
            {
                throw new UnauthorizedAccessException();
            }

            return _tokenGenerator.GenerateToken(user);
        }

        public async Task Register(UserDTO data, string appUrl)
        {         
            data.Password = Hasher.Hash(data.Password);

            var user = await _repository.Create(_mapper.Map(data, new User()));
            var tempData = await _tempDataRepository.Create(new TempData(user.Id.ToString()));

            EmailData emailData = new EmailData(
                new EmailReceiver(user.Email, $"{user.FirstName} {user.LastName}"),
                "Aktywacja konta",
                "ConfirmAccount",
                new ConfirmAccountModel(user.FirstName, $"{appUrl}/api/Email/ConfirmAccount?tempId={tempData.Id}")
            );
            _emailSender.Send(emailData);
        }

        public async Task<User> TryGetUserByEmail(string email)
        {
            return await _repository.Data.SingleOrDefaultAsync(x => x.Email == email);
        }
    }
}
