﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources.Pagination
{
    public class PaginatedData<T> where T : class
    {
        public IEnumerable<T> Data { get; set; }
        public int? TotalCount { get; set; }
    };
}
