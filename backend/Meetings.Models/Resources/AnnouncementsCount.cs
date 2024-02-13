using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources
{
    public class AnnouncementsCount
    {
        public int Active { get; set; }
        public int Pending { get; set; }
        public int Closed { get; set; }
    }
}
