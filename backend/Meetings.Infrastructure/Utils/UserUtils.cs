

using Meetings.Models.Entities;
using Meetings.Models.Resources;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Meetings.Infrastructure.Utils
{
    public static class UserUtils
    {
        public static UserActiveStatus DetermineUserActiveStatus(DateTime lastActiveDate)
        {
            TimeSpan ts = DateTime.UtcNow - lastActiveDate;

            if (ts.TotalMinutes <= 2)
            {
                return UserActiveStatus.Online;
            }
            else if (ts.TotalMinutes <= 30)
            {
                return UserActiveStatus.RecentlyOnline;
            }
            else
            {
                return UserActiveStatus.Offline;
            }
        }

        public static int CalculateAge(DateTime birthDate)
        {
            DateTime today = DateTime.UtcNow;
            int age = today.Year - birthDate.Year;
            int m = today.Month - birthDate.Month;
            if (m < 0 || (m == 0 && today.Date < birthDate.Date))
            {
                age--;
            }

            return age;
        }
    }
}
