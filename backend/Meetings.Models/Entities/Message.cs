﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Entities
{
    public class Message : IEntityBase
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsDelete { get; set; }
        public Guid ChatId { get; set; }
        public virtual Chat Chat { get; set; }
        public Guid AuthorId { get; set; }
        public virtual User Author { get; set; }
        public Guid? ReplyToId { get; set; }
        public virtual Message? ReplyTo { get; set; }
        public string Text { get; set; }
        public virtual ICollection<MessageReaction> Reactions { get; set; }
    }

    public class MessageDTO
    {
        public Guid Id { get; set; }
        public Guid ChatId { get; set; }
        public Guid AuthorId { get; set; }
        public Guid? ReplyToId { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<MessageReactionDTO> Reactions { get; set; }
    }
}
