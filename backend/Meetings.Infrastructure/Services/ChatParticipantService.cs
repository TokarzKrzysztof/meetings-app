using Meetings.Authentication.Services;
using Meetings.Database.Repositories;
using Meetings.Infrastructure.Helpers;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Services
{
    public class ChatParticipantService
    {
        private readonly IRepository<ChatParticipant> _repository;
        private readonly IClaimsReader _claimsReader;
        private readonly ChatValidator _chatValidator;
        private readonly IServices _services;

        public ChatParticipantService(IRepository<ChatParticipant> chatParticipantRepository,
                                      IClaimsReader claimsReader,
                                      ChatValidator chatValidator,
                                      IServices services)
        {
            _repository = chatParticipantRepository;
            _claimsReader = claimsReader;
            _chatValidator = chatValidator;
            _services = services;
        }

        public async Task LeaveGroupChat(Guid chatId)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            await RemoveGroupChatParticipant(chatId, userId, true);
        }

        public async Task RemoveGroupChatParticipant(Guid chatId, Guid userId, bool isFromLeaveChat = false)
        {
            await _chatValidator.WhenRemoveGroupChatParticipant(chatId, userId);

            ChatParticipant item = await _repository.Data.SingleAsync(x => x.ChatId == chatId && x.UserId == userId);
            await _repository.RemovePermanently(item);

            if (isFromLeaveChat)
            {
                string genderTxt = _claimsReader.GetCurrentUserGender() == UserGender.Male ? "opuścił" : "opuściła";
                string info = $"{_claimsReader.GetCurrentUserFirstName()} {genderTxt} grupę.";
                await _services.Message.SendInfoMessage(chatId, info);
            }
            else
            {
                var user = await _services.User.GetUser(userId);
                string genderTxt = _claimsReader.GetCurrentUserGender() == UserGender.Male ? "usunął" : "usunęła";
                string info = $"{_claimsReader.GetCurrentUserFirstName()} {genderTxt} użytkownika {user.FirstName + " " + user.LastName} z grupy.";
                await _services.Message.SendInfoMessage(chatId, info);
            }
        }

        public async Task AddGroupChatParticipant(Guid chatId, Guid userId)
        {
            await _chatValidator.WhenAddGroupChatParticipant(chatId, userId);

            await _repository.Create(new ChatParticipant(userId, chatId));

            var user = await _services.User.GetUser(userId);
            string genderTxt = _claimsReader.GetCurrentUserGender() == UserGender.Male ? "dodał" : "dodała";
            string info = $"{_claimsReader.GetCurrentUserFirstName()} {genderTxt} użytkownika {user.FirstName + " " + user.LastName} do grupy.";
            await _services.Message.SendInfoMessage(chatId, info);
        }

        public async Task<UnreadChatsCountData> GetUnreadChatsCount()
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            var unread = await _repository.Data
                .Where(x => x.UserId == userId && x.HasUnreadMessages && !x.IsIgnored)
                .Select(x => x.Chat.Type).ToListAsync();
            return new UnreadChatsCountData()
            {
                Private = unread.Where(type => type == ChatType.Private).Count(),
                Group = unread.Where(type => type == ChatType.Group).Count(),
            };
        }

        public async Task RemoveUserFromAllGroupChats(Guid userId)
        {
            List<ChatParticipant> participantsInGroupChats = await _repository.Data.Where(x => x.UserId == userId && x.Chat.Type == ChatType.Group).ToListAsync();
            await _repository.RemovePermanentlyRange(participantsInGroupChats);
        }

        public async Task MarkChatAsRead(Guid chatId)
        {
            await GetCurrentUserParticipantQuery(chatId)
                .ExecuteUpdateAsync(s =>
                    s.SetProperty(x => x.HasUnreadMessages, false)
                 );
        }
        public async Task ToggleIgnoreChat(Guid chatId)
        {
            await GetCurrentUserParticipantQuery(chatId)
               .ExecuteUpdateAsync(s =>
                   s.SetProperty(x => x.IsIgnored, x => !x.IsIgnored)
                );
        }
        public async Task ToggleArchiveChat(Guid chatId)
        {
            await GetCurrentUserParticipantQuery(chatId)
                .ExecuteUpdateAsync(s =>
                    s.SetProperty(x => x.IsArchived, x => !x.IsArchived)
                 );
        }
        private IQueryable<ChatParticipant> GetCurrentUserParticipantQuery(Guid chatId)
        {
            Guid userId = _claimsReader.GetCurrentUserId();
            return _repository.Data.Where(x => x.UserId == userId && x.ChatId == chatId);
        }
    }
}
