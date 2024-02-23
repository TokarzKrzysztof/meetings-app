using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Entities
{
    public class Interest
    {
        public Guid Id { get; set; }
        public string IconName { get; set; }
        public string Name { get; set; }
    }
    public class UserProfile : IEntityBase
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsDelete { get; set; }
        public Guid UserId { get; set; }
        public virtual User User { get; set; }
        public string? Description { get; set; }
        public List<Guid> InterestsIds { get; set; } = new List<Guid>();
    }

    public class UserProfileDTO
    {
        public Guid Id { get; set; }
        public virtual UserDTO User { get; set; }
        public string? Description { get; set; }
        public List<Interest> Interests { get; set; }
    }
}
