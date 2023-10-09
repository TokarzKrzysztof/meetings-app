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
        private readonly IRepository<TempData> _tempDataRepository;
        public UserService(IRepository<User> repository, IMapper mapper, IRepository<TempData> tempDataRepository)
        {
            _repository = repository;
            _mapper = mapper;
            _tempDataRepository = tempDataRepository;
        }

        public async Task ConfirmAccount(Guid tempId)
        {
            var tempData = await _tempDataRepository.GetById(tempId);
            var user = await _repository.GetById(new Guid(tempData.Data));

            user.IsActive = true;

            await _repository.Update(user);
            await _tempDataRepository.RemovePermanently(tempData);
        }

        public Task<bool> IsEmailTaken(string email)
        {
            return _repository.Data.AnyAsync(x => x.Email == email);
        }
    }
}
