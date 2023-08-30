using Meetings.Database.Repositories;
using Meetings.Infrastructure.Services.Interfaces;
using Meetings.Models.Entities;
using Meetings.Utils;
using Meetings.Utils.Extensions;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using FluentValidation.Results;
using FluentValidation;
using AutoMapper;

namespace Meetings.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _repository;
        private readonly IValidator<UserResource> _validator;
        private readonly IMapper _mapper;
        public UserService(IRepository<User> repository, IValidator<UserResource> validator, IMapper mapper)
        {
            _repository = repository;
            _validator = validator;
            _mapper = mapper;
        }

        public async Task Register(UserResource data)
        {
            var results = _validator.Validate(data);
            if (!results.IsValid) throw new AppValidationException(results);

            data.Password = PasswordHasher.Hash(data.Password);
            
            await _repository.Create(_mapper.Map(data, new User()));
        }

        public async Task<User> TryGetUserByEmail(string email)
        {
            return await _repository.Data.SingleOrDefaultAsync(x => x.Email == email);
        }
    }
}
