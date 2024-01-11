using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Utilities
{
    public static class DateUtils
    {
        public static DateTime GetRandomDate(DateTime from, DateTime to)
        {
            int range = (to - from).Days;
            return from.AddDays(Utils.Random.Next(range));
        }
    }
}
