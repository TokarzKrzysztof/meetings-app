using Meetings.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Services.Interfaces
{
    public interface IUserService
    {
        Task<User> TryGetUserByEmail(string email);
        Task Register(UserResource data);
    }
}
