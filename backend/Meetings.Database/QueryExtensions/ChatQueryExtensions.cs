using Meetings.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Database.QueryExtensions
{
    public static class ChatQueryExtensions
    {
        public static IQueryable<Chat> ByParticipants(this IQueryable<Chat> query, Guid participant1Id, Guid participant2Id)
        {
            return query.Where(x => x.Participants.Select(x => x.UserId).Contains(participant1Id) && x.Participants.Select(x => x.UserId).Contains(participant2Id));
        }
        public static IQueryable<Chat> IncludeAllMessagesData(this IQueryable<Chat> query)
        {
            return query
                .Include(x => x.Messages).ThenInclude(x => x.Reactions)
                .Include(x => x.Messages).ThenInclude(x => x.ReplyTo);
        }
    }
}
