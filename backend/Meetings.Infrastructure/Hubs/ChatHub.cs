﻿using Meetings.Authentication;
using Meetings.Database.Repositories;
using Meetings.Infrastructure.Services;
using Meetings.Models.Entities;
using Meetings.Utils.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Meetings.Infrastructure.Hubs
{
    public record SendPrivateMessageData(Guid RecipientId, string Text, MessageDTO? ReplyTo);
    public record StartTypingData(Guid ChatId);
    public record SetMessageReactionData(Guid MessageId, string ReactionUnified);
    public record StartListenNewChatData(Guid ChatId);

    public interface IChatHub
    {
        Task OnGetNewMessage(MessageDTO message);
        Task OnOtherUserTyping(Guid userId);
        Task OnMessageReactionChange(MessageDTO message);
        Task OnNewChatCreated(Guid chatId);
    }

    public class ChatHub : Hub<IChatHub>
    {
        private readonly ChatService _chatService;
        private readonly IRepository<ChatParticipant> _chatParticipantRepository;
        public ChatHub(ChatService chatService, IRepository<ChatParticipant> chatParticipantRepository)
        {
            _chatService = chatService;
            _chatParticipantRepository = chatParticipantRepository;
        }

        private Guid CurrentUserId
        {
            get
            {
                return new Guid(Context.UserIdentifier);
            }
        }

        public override async Task OnConnectedAsync()
        {
            var userChatIds = await _chatParticipantRepository.Data.Where(x => x.UserId == CurrentUserId).Select(x => x.ChatId).ToListAsync();
            foreach (Guid id in userChatIds)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, id.ToString());
            }

            await base.OnConnectedAsync();
        }

        [Authorize]
        public async Task SendPrivateMessage(SendPrivateMessageData data)
        {
            MessageDTO message = await _chatService.SendPrivateMessage(Context.ConnectionId, data.RecipientId, new MessageDTO()
            {
                AuthorId = CurrentUserId,
                Text = data.Text,
                ReplyTo = data.ReplyTo,
            });

            await Clients.Group(message.ChatId.ToString()).OnGetNewMessage(message);
        }

        [Authorize]
        public async Task StartTyping(StartTypingData data)
        {
            await Clients.OthersInGroup(data.ChatId.ToString()).OnOtherUserTyping(CurrentUserId);
        }

        [Authorize]
        public async Task SetMessageReaction(SetMessageReactionData data)
        {
            MessageDTO message = await _chatService.SetMessageReaction(new MessageReactionDTO()
            {
                AuthorId = CurrentUserId,
                MessageId = data.MessageId,
                Unified = data.ReactionUnified
            });

            await Clients.Group(message.ChatId.ToString()).OnMessageReactionChange(message);
        }

        [Authorize]
        public async Task StartListenNewChat(StartListenNewChatData data)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, data.ChatId.ToString());
        }
    }
}