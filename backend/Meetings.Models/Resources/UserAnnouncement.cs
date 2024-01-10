using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources
{
    public class UserAnnouncement
    {
        public Guid UserId { get; set; }
        public Guid AnnouncementId { get; set; }
        public string Description { get; set; }
        public UserDTO User { get; set; }
        public int UserAge { get; set; }
        public int? DistanceFromCurrentUser { get; set; }
    }
}
