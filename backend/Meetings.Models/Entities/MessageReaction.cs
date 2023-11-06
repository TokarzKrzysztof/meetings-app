using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Entities
{
    public class MessageReaction : IEntityBase
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsDelete { get; set; }
        public Guid AuthorId { get; set; }
        public virtual User Author { get; set; }
        public Guid MessageId { get; set; }
        public virtual Message Message { get; set; }
        public string Unified { get; set; }
    }
    public class MessageReactionDTO
    {
        public Guid Id { get; set; }
        public Guid MessageId { get; set; }
        public Guid AuthorId { get; set; }
        public string Unified { get; set; }
    }
}
