using Meetings.Models.Entities;
using Meetings.Models.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Database.Repositories
{
    public class UserRepository : Repository<User>
    {
        private readonly ApplicationDbContext _db;

        public UserRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public async Task<User> CreateUserWithProfile(User user)
        {
            Guid userId = Guid.NewGuid();
            Guid userProfileId = Guid.NewGuid();

            user.Id = userId;
            user.UserProfileId = userProfileId;
            user.UserProfile = new UserProfile()
            {
                Id = userProfileId,
                UserId = userId,
            };

            AssignCreateProperties(user);
            AssignCreateProperties(user.UserProfile);

            _db.Add(user);

            await _db.SaveChangesAsync();

            return user;
        }
    }
}
