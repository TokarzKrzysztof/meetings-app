using Meetings.Database.Repositories;
using Meetings.Infrastructure.Services.Interfaces;
using Meetings.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Services
{
    public class UserService: IUserService
    {
        private readonly IRepository<User> _repository;
        public UserService(IRepository<User> repository)
        {
            _repository = repository;
        }

        public async Task<string> Register(UserResource data)
        {

            await _repository.Create(data);
            return "";
        }
    }
}
