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
        public string Name { get; set; }
        public ChatType Type { get; set; }
        public bool HasUnreadMessages { get; set; }
        public bool HasLastMessage { get; set; }
        public Guid? LastMessageAuthorId { get; set; }
        public string? LastMessageValue { get; set; }
        public DateTime? LastMessageDate { get; set; }
        public MessageType? LastMessageType { get; set; }
        public IEnumerable<string?> ImageSrcs { get; set; }
        public UserGender? LastMessageAuthorGender { get; set; }
        public string? LastMessageAuthorFirstName { get; set; }
        public Guid? ParticipantId { get; set; }
        public UserActiveStatus? ParticipantActiveStatus { get; set; }
    }
}
