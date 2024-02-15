using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources.Pagination
{
    public class GetCurrentUserChatsData: PaginationParams
    {
        public UserChatType Type { get; set; }
    }
}
