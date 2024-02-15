using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources
{
    public class SetAnnouncementStatusData
    {
        public Guid Id { get; set; }
        public AnnouncementStatus NewStatus { get; set; }
    }
}
