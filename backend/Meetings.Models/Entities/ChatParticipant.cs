using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Entities
{
    public class ChatParticipant: IEntityBase
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsDelete { get; set; }
        public Guid UserId { get; set; }
        public virtual User User { get; set; }
        public Guid ChatId { get; set; }
        public virtual Chat Chat { get; set; }
        public bool HasUnreadMessages { get; set; }
        public bool IsArchived { get; set; }
        public bool IsIgnored { get; set; }

        public ChatParticipant(Guid userId)
        {
            UserId = userId;
        }
    }
}
