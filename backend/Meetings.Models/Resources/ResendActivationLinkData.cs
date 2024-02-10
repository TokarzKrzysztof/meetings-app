using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Resources
{
    public class ResendActivationLinkData
    {
        public string Email { get; set; }
        public string? RedirectUrl { get; set; }
    }
}
