﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources
{
    public class AnnouncementQueryParams
    {
        public Guid CategoryId { get; set; }
        public int MaxAge { get; set; }
    }
}
