﻿using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources.Pagination
{
    public class GetCurrentUserAnnouncementsData: PaginationParams
    {
        public AnnouncementStatus Status { get; set; }
        public string Filter { get; set; }
    }
}
