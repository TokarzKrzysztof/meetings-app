using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Entities
{
    public class Category : IEntityBase
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsDelete { get; set; }
        public string Name { get; set; }
        public bool HasExperienceLevel { get; set; }
    }
    public class CategoryDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public bool HasExperienceLevel { get; set; }
    }
}
