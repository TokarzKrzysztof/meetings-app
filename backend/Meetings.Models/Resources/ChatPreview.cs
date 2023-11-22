using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources
{
    public class ChatPreview
    {
        public Guid Id { get; set; }
        public Guid ParticipantId { get; set; }
        public string ParticipantName { get; set; }
        public bool HasUnreadMessages { get; set; }
        public Guid? LastMessageAuthorId { get; set; }
        public string? LastMessageText { get; set; }
        public DateTime? LastMessageDate { get; set; }
    }
}
