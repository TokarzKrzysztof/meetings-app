using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Entities
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

    public class ResultListFilters
    {
        public Guid CategoryId { get; set; }
        public int DistanceMax { get; set; }
        public int[] AgeRange { get; set; }
        public UserGender? Gender { get; set; }
        public AnnouncementExperienceLevel? ExperienceLevel { get; set; }
    }

    public class ObservedSearch : ResultListFilters, IEntityBase
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsDelete { get; set; }
        public Guid UserId { get; set; }
        public virtual User User { get; set; }
        public virtual Category Category { get; set; }
        public int NewAnnouncementsCount { get; set; }
        public bool IsEmailNotificationEnabled { get; set; }
        public bool ShouldSendEmail { get; set; }
        public string ResultListUrl { get; set; }
    }
    public class ObservedSearchDTO : ResultListFilters
    {
        public Guid Id { get; set; }
        public int NewAnnouncementsCount { get; set; }
        public bool IsEmailNotificationEnabled { get; set; }
        public string ResultListUrl { get; set; }
        // nullable for AddObservedSearch
        public virtual CategoryDTO? Category { get; set; }
    }
}
