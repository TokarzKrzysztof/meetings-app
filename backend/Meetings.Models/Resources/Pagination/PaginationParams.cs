using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources.Pagination
{
    public class PaginationParams
    {
        public int Skip { get; set; }
        public int Take { get; set; }
    }
}
