using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Entities
{
    public class Category : EntityBase
    {
        public string Name { get; set; }
    }
    public class CategoryDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
