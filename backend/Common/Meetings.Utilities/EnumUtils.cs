using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Utilities
{
    public static class EnumUtils
    {      
        public static T GetRandomValue<T>() where T : Enum
        {
            var v = Enum.GetValues(typeof(T));
            return (T)v.GetValue(Utils.Random.Next(v.Length));
        }
    }
}
