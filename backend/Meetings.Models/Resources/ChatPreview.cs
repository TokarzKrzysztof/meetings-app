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
        public string ParticipantFirstName { get; set; }
        public string ParticipantLastName { get; set; }
        public UserGender ParticipantGender { get; set; }
        public string? ParticipantProfileImageSrc { get; set; }
        public UserActiveStatus ParticipantActiveStatus { get; set; }
        public bool HasUnreadMessages { get; set; }
        public bool HasLastMessage { get; set; }
        public Guid? LastMessageAuthorId { get; set; }
        public string? LastMessageValue { get; set; }
        public DateTime? LastMessageDate { get; set; }
        public MessageType? LastMessageType { get; set; }
    }
}
