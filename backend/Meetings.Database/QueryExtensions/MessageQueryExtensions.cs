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
        public static IQueryable<Message> IncludeAuthors(this IQueryable<Message> query)
        {
            return query.Include(x => x.Author)
                        .Include(x => x.ReplyTo).ThenInclude(x => x.Author);
        }
    }
}
