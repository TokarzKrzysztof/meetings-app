using Meetings.Authentication;
using Meetings.Infrastructure.Services;
using Meetings.Models.Entities;
using Meetings.Utils.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Meetings.Api.Hubs
{
    public record SendPrivateMessageData(Guid RecipientId, string Message);
    public record StartTypingData(Guid RecipientId);
    public record AddMessageReactionData(Guid RecipientId, Guid MessageId, string ReactionUnified);

    public class AppHub : Hub
    {
        private ChatService _chatService;
        public AppHub(ChatService chatService)
        {
            _chatService = chatService;
        }

        [Authorize]
        public async Task SendPrivateMessage(SendPrivateMessageData data)
        {
            var result = await _chatService.SendPrivateMessage(new Guid(Context.UserIdentifier), data.Message, data.RecipientId);
            await Clients.Users(Context.UserIdentifier, data.RecipientId.ToString()).SendAsync("onGetNewMessage", result);
        }

        [Authorize]
        public async Task StartTyping(StartTypingData data)
        {
            await Clients.User(data.RecipientId.ToString()).SendAsync("onOtherUserTyping", Context.UserIdentifier);
        }

        [Authorize]
        public async Task AddMessageReaction(AddMessageReactionData data)
        {
            MessageDTO result = await _chatService.AddMessageReaction(new MessageReactionDTO()
            {
                AuthorId = new Guid(Context.UserIdentifier),
                MessageId = data.MessageId,
                Unified = data.ReactionUnified
            });

            await Clients.Users(Context.UserIdentifier, data.RecipientId.ToString()).SendAsync("onMessageUpdate", result);
        }
    }
}