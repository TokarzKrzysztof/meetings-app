﻿using Meetings.Authentication;
using Meetings.Database.Repositories;
using Meetings.Infrastructure.Services;
using Meetings.Models.Entities;
using Meetings.Utilities.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Meetings.Infrastructure.Hubs
{
    public record StartTypingData(Guid ChatId);
    public record SetMessageReactionData(Guid MessageId, string ReactionUnified);
    public record StartListenNewChatData(Guid ChatId);

    public interface IChatHub
    {
        Task OnGetNewMessage(MessageDTO message, Guid ChatId);
        Task OnOtherUserTyping(Guid userId, string firstName, Guid ChatId);
        Task OnMessageReactionChange(MessageDTO message, Guid ChatId);
    }

    public class ChatHub : Hub<IChatHub>
    {
        private readonly ChatService _chatService;
        private readonly MessageReactionService _messageReactionService;
        private readonly IRepository<ChatParticipant> _chatParticipantRepository;
        public ChatHub(ChatService chatService, IRepository<ChatParticipant> chatParticipantRepository, MessageReactionService messageReactionService)
        {
            _chatService = chatService;
            _chatParticipantRepository = chatParticipantRepository;
            _messageReactionService = messageReactionService;
        }

        private Guid CurrentUserId
        {
            get
            {
                return new Guid(Context.User!.FindFirstValue(CustomClaims.Id)!);
            }
        }
        private string CurrentUserFirstName
        {
            get
            {
                return Context.User!.FindFirstValue(CustomClaims.FirstName)!;
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
        public async Task StartTyping(StartTypingData data)
        {
            await Clients.OthersInGroup(data.ChatId.ToString()).OnOtherUserTyping(CurrentUserId, CurrentUserFirstName, data.ChatId);
        }

        [Authorize]
        public async Task SetMessageReaction(SetMessageReactionData data)
        {
            MessageDTO message = await _messageReactionService.SetMessageReaction(new MessageReactionDTO()
            {
                AuthorId = CurrentUserId,
                MessageId = data.MessageId,
                Unified = data.ReactionUnified
            });
            
            await Clients.Group(message.ChatId.ToString()).OnMessageReactionChange(message, message.ChatId);
        }
    }
}