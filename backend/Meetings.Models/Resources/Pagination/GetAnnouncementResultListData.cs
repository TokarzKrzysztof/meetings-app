using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Meetings.Models.Resources.Pagination
{
    public enum SortOption
    {
        Newest,
        Oldest,
        DistanceMin,
        DistanceMax,
    }
    public class AnnouncementFilterConstants
    {
        public const int MinAge = 0;
        public const int MaxAge = 100;
    }
    public class GetAnnouncementResultListData : PaginationParams
    {
        public Guid CategoryId { get; set; }
        public int DistanceMax { get; set; }
        public int[] AgeRange { get; set; }
        public SortOption SortBy { get; set; }
        public UserGender? Gender { get; set; }
        public AnnouncementExperienceLevel? ExperienceLevel { get; set; }
    }
}

