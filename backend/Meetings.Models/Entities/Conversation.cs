using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Entities
{
    public class Conversation : IEntityBase
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsDelete { get; set; }
        public ICollection<Message> Messages { get; set; }
        public List<Guid> ParticipantIds { get; set; }
    }

    public class ConversationDTO
    {
        public Guid Id { get; set; }
        public List<Guid> ParticipantIds { get; set; }
        public List<MessageDTO> Messages { get; set; }
    }
}
