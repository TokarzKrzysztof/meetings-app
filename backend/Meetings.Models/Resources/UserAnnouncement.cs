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
        public DateTime UserBirthDate { get; set; }
        public string UserFirstName { get; set; }
        public string? UserProfileImageSrc { get; set; }
    }
}
