using Meetings.Database.Repositories;
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
    public class UserService
    {
        private readonly IRepository<User> _repository;
        private readonly IMapper _mapper;
        public UserService(IRepository<User> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public Task<bool> IsEmailTaken(string email)
        {
            return _repository.Data.AnyAsync(x => x.Email == email);
        }
    }
}
