﻿using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources.Pagination
{
    public class GetCurrentUserAnnouncementsData: IPaginationParams
    {
        public int Skip { get; set; }
        public int Take { get; set; }
        public AnnouncementStatus Status { get; set; }
        public string Filter { get; set; }
    }
}
