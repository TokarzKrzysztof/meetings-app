using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Entities
{
    public class UserProfile : IEntityBase
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsDelete { get; set; }
        public Guid UserId { get; set; }
        public virtual User User { get; set; }
        public string? Description { get; set; }
        public string[] Interests { get; set; } = Array.Empty<string>();
        public string? ImagePath { get; set; }
    }

    public class UserProfileDTO
    {
        public Guid Id { get; set; }
        public virtual UserDTO User { get; set; }
        public string? Description { get; set; }
        public string[] Interests { get; set; }
        public string? ImagePath { get; set; }
    }
}
