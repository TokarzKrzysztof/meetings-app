using AutoMapper;
using FluentValidation;
using Meetings.Authentication;
using Meetings.Database.Repositories;
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
        private readonly IValidator<UserResource> _validator;
        private readonly IRepository<User> _repository;
        private readonly IMapper _mapper;
        public AuthService(ITokenGenerator tokenGenerator, IValidator<UserResource> validator, IRepository<User> repository, IMapper mapper)
        {
            _tokenGenerator = tokenGenerator;
            _validator = validator;
            _repository = repository;
            _mapper = mapper;
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

        public async Task Register(UserResource data)
        {
            var results = _validator.Validate(data);
            if (!results.IsValid) throw new AppValidationException(results);

            data.Password = Hasher.Hash(data.Password);

            await _repository.Create(_mapper.Map(data, new User()));
        }

        public async Task<User> TryGetUserByEmail(string email)
        {
            return await _repository.Data.SingleOrDefaultAsync(x => x.Email == email);
        }
    }
}
