using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Meetings.Models.Resources
{
    public class GenderFilter
    {
        public const string All = "all";
        public const string Males = "males";
        public const string Females = "females";

        public static string[] AvailableFilters => new string[] { All, Males, Females };
    }
    public class AnnouncementFilterConstants
    {
        public const int DistanceMax = 500;
        public const int MinAge = 0;
        public const int MaxAge = 100;
    }
    public class AnnouncementSearchParams
    {
        public Guid CategoryId { get; set; }
        public string Gender { get; set; }
        public int DistanceMax { get; set; }
        public int[] AgeRange { get; set; }
    }
}

