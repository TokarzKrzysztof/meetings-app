using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Meetings.Utils
{
    public static class EmailUtils
    {
        public static bool IsValidEmail(string email)
        {
            string regex = @"/\S+@\S+\.\S+/";
            return Regex.IsMatch(email, regex, RegexOptions.IgnoreCase);
        }
    }
}
