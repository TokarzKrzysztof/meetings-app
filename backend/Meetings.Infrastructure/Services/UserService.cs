using Meetings.Database.Repositories;
using Meetings.Infrastructure.Services.Interfaces;
using Meetings.Models.User;
using Meetings.Utils.Extensions;
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
            data.ValidateRequired(x => x.FirstName);
            data.ValidateRequired(x => x.LastName);
            data.ValidateRequired(x => x.Password);
            data.ValidateRequired(x => x.PasswordRepeat);
            data.ValidateEmail(x => x.Email);

            if (data.Password != data.PasswordRepeat)
            {
                throw new Exception("Passwords do not match");
            }

            await _repository.Create(data);
            return "";
        }
    }
}
