using Meetings.Authentication;
using Meetings.Infrastructure.Services;
using Meetings.Models.Entities;
using Meetings.Utils.Extensions;
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
        public async Task SendPrivateMessage(string message, Guid recipientId)
        {
            var result = await _conversationService.SendMessage(new Guid(Context.UserIdentifier), message, recipientId);
            await Clients.Users(Context.UserIdentifier, recipientId.ToString()).SendAsync("onGetPrivateMessage", result);
        }

        [Authorize]
        public async Task StartTyping(Guid recipientId)
        {
            await Clients.User(recipientId.ToString()).SendAsync("onOtherUserTyping", Context.UserIdentifier);
        }
    }
}