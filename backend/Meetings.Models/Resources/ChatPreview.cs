using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Meetings.Models.Resources
{
    public class ChatPreview
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public ChatType Type { get; set; }
        public bool HasUnreadMessages { get; set; }
        public MessageDTO LastMessage { get; set; }
        public UserDTO LastMessageAuthor { get; set; }
        public List<UserDTO> Participants { get; set; }
    }
}