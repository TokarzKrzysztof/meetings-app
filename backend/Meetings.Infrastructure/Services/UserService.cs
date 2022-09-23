using Meetings.Database.Repositories;
using Meetings.Infrastructure.Services.Interfaces;
using Meetings.Models.User;
using Meetings.Utils;
using Meetings.Utils.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _repository;
        public UserService(IRepository<User> repository)
        {
            _repository = repository;
        }

        public async Task Register(UserResource data)
        {
            data.ValidateRequired(x => x.FirstName);
            data.ValidateRequired(x => x.LastName);
            data.ValidateRequired(x => x.Password);
            data.ValidateRequired(x => x.PasswordRepeat);
            data.ValidateEmail(x => x.Email);
            if (data.Password != data.PasswordRepeat) throw new ValidationException("Passwords do not match");

            data.Password = PasswordHasher.Hash(data.Password);
            
            await _repository.Create(data);
        }
    }
}
