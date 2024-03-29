﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Entities
{
    public enum UserChatType
    {
        Private,
        Group,
        Ignored,
        Archived
    }
    public enum ChatType
    {
        Private,
        Group
    }
    public class Chat : IEntityBase
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsDelete { get; set; }
        public string? Name { get; set; }
        public ChatType Type { get; set; }
        public virtual ICollection<Message> Messages { get; set; }
        public virtual ICollection<ChatParticipant> Participants { get; set; }
    }

    public class ChatDTO
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public int TotalMessagesAmount { get; set; }
        public ChatType Type { get; set; }
        public List<UserDTO> Participants { get; set; }
    }
}
