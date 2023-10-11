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

namespace Meetings.Infrastructure.Services
{
    public class UserService
    {
        private readonly IRepository<User> _repository;
        private readonly IMapper _mapper;
        private readonly IRepository<TempData> _tempDataRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserService(IRepository<User> repository, IMapper mapper, IRepository<TempData> tempDataRepository, IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _mapper = mapper;
            _tempDataRepository = tempDataRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task ConfirmAccount(Guid tempId)
        {
            var tempData = await _tempDataRepository.GetById(tempId);
            var user = await _repository.GetById(new Guid(tempData.Data));

            user.IsActive = true;

            await _repository.Update(user);
            await _tempDataRepository.RemovePermanently(tempData);
        }

        public async Task<UserDTO> GetCurrentUser()
        {
            IEnumerable<Claim> claims = _httpContextAccessor.HttpContext.User.Claims;
            if (!claims.Any())
            {
                return null;
            }

            Guid userId = new Guid(claims.Single(x => x.Type == UserClaims.Id).Value);
            var user = await _repository.GetById(userId);

            return _mapper.Map<UserDTO>(user);
        }

        public Task<bool> IsEmailTaken(string email)
        {
            return _repository.Data.AnyAsync(x => x.Email == email);
        }
    }
}
