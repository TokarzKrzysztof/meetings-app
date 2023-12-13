using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources
{
    public class EditGroupChatData
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<Guid> UserIds { get; set; }
    }
}
