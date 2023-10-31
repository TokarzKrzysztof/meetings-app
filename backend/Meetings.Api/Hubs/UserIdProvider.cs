using Meetings.Authentication;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Meetings.Api.Hubs
{
    public class UserIdProvider : IUserIdProvider
    {
        public virtual string GetUserId(HubConnectionContext connection)
        {
            return connection.User.FindFirstValue(UserClaims.Id);
        }
    }
}
