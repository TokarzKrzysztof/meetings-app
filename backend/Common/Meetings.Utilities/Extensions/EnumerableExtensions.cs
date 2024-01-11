using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Utilities.Extensions
{
    internal static class EnumerableHelper
    {
        public static T Random<T>(IEnumerable<T> input)
        {
            return input.ElementAt(Utils.Random.Next(input.Count()));
        }
    }

    public static class EnumerableExtensions
    {
        public static T Random<T>(this IEnumerable<T> input)
        {
            return EnumerableHelper.Random(input);
        }
    }
}
