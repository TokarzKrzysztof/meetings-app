using Meetings.Models.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Entites
{
    public class UserLocation: IEntityBase
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsDelete { get; set; }
        public string City { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string AdminName { get; set; }
    }

    public class UserLocationDTO
    {
        public Guid Id { get; set; }
        public string City { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string AdminName { get; set; }
    }
}
