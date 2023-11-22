

using Meetings.Models.Entities;
using Meetings.Models.Resources;

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
    }
}
