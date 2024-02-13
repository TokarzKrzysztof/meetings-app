using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Database.QueryExtensions
{
    public static class AnnouncementQueryExtensions
    {
        public static IQueryable<Announcement> GetActivelyOccupiedByUser(this IQueryable<Announcement> query, Guid userId)
        {
            return query.Where(x => x.UserId == userId && (x.Status == AnnoucementStatus.Active || x.Status == AnnoucementStatus.Pending));
        }
    }
}
