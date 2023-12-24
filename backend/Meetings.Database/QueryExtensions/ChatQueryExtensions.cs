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
        public static IQueryable<Chat> GetPrivateByParticipants(this IQueryable<Chat> query, Guid participant1Id, Guid participant2Id)
        {
            var ids = new List<Guid>() { participant1Id, participant2Id }.AsEnumerable();
            return query.Where(x => x.Type == ChatType.Private && !x.Participants.Select(x => x.UserId).Except(ids).Any());
        }
        public static IQueryable<Chat> IncludeAllMessagesData(this IQueryable<Chat> query)
        {
            return query
                .Include(x => x.Messages).ThenInclude(x => x.Reactions)
                .Include(x => x.Messages).ThenInclude(x => x.ReplyTo);
        }
        public static IQueryable<Chat> IncludeParticipants(this IQueryable<Chat> query)
        {
            return query.Include(x => x.Participants).ThenInclude(x => x.User);
        }
        public static IQueryable<Chat> IncludeLastMessageWithAuthor(this IQueryable<Chat> query)
        {
            return query.Include(x => x.Messages.OrderByDescending(msg => msg.CreatedAt).Take(1)).ThenInclude(x => x.Author);
        }
    }
}
