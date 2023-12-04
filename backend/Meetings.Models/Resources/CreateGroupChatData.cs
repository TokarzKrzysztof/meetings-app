using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources
{
    public class CreateGroupChatData
    {
        public string Name { get; set; }
        public List<Guid> UserIds { get; set; }
        public string ConnectionId { get; set; }
    }
}
