using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources
{
    public class ChangePasswordData
    {
        public string ExistingPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
