using Meetings.Authentication;
using Meetings.Database.Repositories;
using Meetings.Infrastructure.Services;
using Meetings.Models.Entities;
using Meetings.Utils.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Meetings.Infrastructure.Hubs
{
    public record SendPrivateMessageData(Guid RecipientId, string Message);
    public record StartTypingData(Guid ChatId);
    public record AddMessageReactionData(Guid MessageId, string ReactionUnified);

    public class ChatHub : Hub
    {
        private readonly ChatService _chatService;
        private readonly IRepository<User> _userRepository;
        public ChatHub(ChatService chatService, IRepository<User> userRepository)
        {
            _chatService = chatService;
            _userRepository = userRepository;
        }

        public override async Task OnConnectedAsync()
        {
            var userChatIds = await _userRepository.Data.Where(x => x.Id == new Guid(Context.UserIdentifier)).SelectMany(x => x.Chats.Select(x => x.Id)).ToListAsync();
            foreach (Guid id in userChatIds)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, id.ToString());
            }

            await base.OnConnectedAsync();
        }

        [Authorize]
        public async Task SendPrivateMessage(SendPrivateMessageData data)
        {
            var message = await _chatService.SendPrivateMessage(new Guid(Context.UserIdentifier), data.Message, data.RecipientId, Context.ConnectionId);
            await Clients.Group(message.ChatId.ToString()).SendAsync("onGetNewMessage", message);
        }

        [Authorize]
        public async Task StartTyping(StartTypingData data)
        {
            await Clients.OthersInGroup(data.ChatId.ToString()).SendAsync("onOtherUserTyping", Context.UserIdentifier);
        }

        [Authorize]
        public async Task AddMessageReaction(AddMessageReactionData data)
        {
            MessageDTO message = await _chatService.AddMessageReaction(new MessageReactionDTO()
            {
                AuthorId = new Guid(Context.UserIdentifier),
                MessageId = data.MessageId,
                Unified = data.ReactionUnified
            });

            await Clients.Group(message.ChatId.ToString()).SendAsync("onMessageUpdate", message);
        }
    }
}