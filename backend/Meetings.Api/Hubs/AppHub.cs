using Meetings.Authentication;
using Meetings.Infrastructure.Services;
using Meetings.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Meetings.Api.Hubs
{
    public class AppHub : Hub
    {
        private ConversationService _conversationService;
        public AppHub(ConversationService conversationService)
        {
            _conversationService = conversationService;
        }

        [Authorize]
        public async Task SendPrivateMessage(string message, string recipientId)
        {
            var result = await _conversationService.SendMessage(new Guid(Context.UserIdentifier), message, new Guid(recipientId));
            await Clients.Users(Context.UserIdentifier, recipientId).SendAsync("onGetPrivateMessage", result);
        }
    }
}