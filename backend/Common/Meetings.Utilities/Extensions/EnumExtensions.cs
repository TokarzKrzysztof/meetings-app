using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Utilities.Extensions
{
    public static class EnumExtensions
    {
        public static string ToIntegerString<T>(this T value) where T: Enum
        {
            return ((int)(object)value).ToString();
        }
    }
}
