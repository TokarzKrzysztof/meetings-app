using Meetings.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Database.QueryExtensions
{
    public static class MessageQueryExtensions
    {
        public static IQueryable<Message> IncludeAllMessagesData(this IQueryable<Message> query)
        {
            return query.Include(x => x.Reactions).Include(x => x.ReplyTo);
        }
    }
}
