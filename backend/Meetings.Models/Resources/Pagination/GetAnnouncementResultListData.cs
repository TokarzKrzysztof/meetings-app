using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Meetings.Models.Resources.Pagination
{
    public class GetAnnouncementResultListData : ResultListFilters, IPaginationParams
    {
        public SortOption SortBy { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
    }
}

