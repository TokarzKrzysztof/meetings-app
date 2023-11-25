using Meetings.Models.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources
{
    public class SendPrivateMessageData
    {
        public Guid Id { get; set; }
        public IFormFile? File { get; set; }
        public string ConnectionId { get; set; }
        public Guid RecipientId { get; set; }
        public string? Value { get; set; }
        public Guid? ReplyToId { get; set; }
        public MessageType Type { get; set; }
    }
}
