using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Entities
{
    public enum AnnouncementStatus
    {
        Active,
        Pending,
        Closed,
    }
    public class Announcement : IEntityBase
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsDelete { get; set; }
        public Guid CategoryId { get; set; }
        public virtual Category Category { get; set; }
        public Guid UserId { get; set; }
        public virtual User User { get; set; }
        public string Description { get; set; }
        public AnnouncementStatus Status { get; set; }
    }

    public class AnnouncementDTO
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public Guid UserId { get; set; }
        public string Description { get; set; }
        public AnnouncementStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
