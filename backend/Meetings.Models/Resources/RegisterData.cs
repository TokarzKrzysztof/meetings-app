using Meetings.Models.Entites;
using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources
{
    public class RegisterData: UserDTO
    {
        public string? RedirectUrl { get; set; }
        // avoid throwing error on register
        public new UserLocation? Location { get; set; }
    }
}
