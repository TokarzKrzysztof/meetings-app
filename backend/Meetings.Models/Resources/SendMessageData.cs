using Meetings.Models.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources
{
    public class SendMessageData
    {
        public Guid Id { get; set; }
        public IFormFile? File { get; set; }
        public string? Value { get; set; }
        public Guid? ReplyToId { get; set; }
        public MessageType Type { get; set; }
        public Guid ChatId { get; set; }
    }
}
