using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources
{
    public class ChangeGroupChatNameData
    {
        public Guid ChatId { get; set; }
        public string Name { get; set; }
    }
}
