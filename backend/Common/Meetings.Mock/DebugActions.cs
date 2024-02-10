using Meetings.Database;
using Meetings.Database.Repositories;
using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Mock
{
    public class DebugActions
    {
        private readonly ApplicationDbContext _db;
        private readonly IRepository<User> _userRepository;
        public DebugActions(ApplicationDbContext db, IRepository<User> userRepository)
        {
            _db = db;
            _userRepository = userRepository;
        }

        public async Task RemoveUserWithEmail(string email)
        {
            var user = _userRepository.Data.Single(x => x.Email == email);
            await _userRepository.Remove(user);
        }
    }
}
