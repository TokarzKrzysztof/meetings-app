using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources
{
    public class CreatePrivateChatData
    {
        public Guid ParticipantId { get; set; }
        public string ConnectionId { get; set; }
    }
}
