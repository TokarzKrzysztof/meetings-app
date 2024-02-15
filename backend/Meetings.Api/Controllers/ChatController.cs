using Meetings.Infrastructure.Hubs;
using Meetings.Infrastructure.Services;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Meetings.Models.Resources.Pagination;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Meetings.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ChatController : AppControllerBase
    {
        private readonly ChatService _chatService;
        public ChatController(ChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPrivateChat([FromQuery] Guid participantId)
        {
            ChatDTO? chat = await _chatService.GetPrivateChat(participantId);
            return Ok(chat);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetGroupChat([FromQuery] Guid chatId)
        {
            ChatDTO chat = await _chatService.GetGroupChat(chatId);
            return Ok(chat);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> GetCurrentUserChats([FromBody] GetCurrentUserChatsData data)
        {
            PaginatedData<ChatPreview> chats = await _chatService.GetCurrentUserChats(data);
            return Ok(chats);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUnreadChatsCount()
        {
            UnreadChatsCountData count = await _chatService.GetUnreadChatsCount();
            return Ok(count);
        }

        [HttpPatch]
        [Authorize]
        public async Task<IActionResult> MarkChatAsRead([FromQuery] Guid chatId)
        {
            await _chatService.MarkChatAsRead(chatId);
            return Ok();
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePrivateChat([FromBody] CreatePrivateChatData data)
        {
            ChatDTO chat = await _chatService.CreatePrivateChat(data);
            return Ok(chat);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateGroupChat([FromBody] CreateGroupChatData data)
        {
            Guid chatId = await _chatService.CreateGroupChat(data);
            return Ok(chatId);
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> LeaveGroupChat([FromQuery] Guid chatId)
        {
            await _chatService.LeaveGroupChat(chatId);
            return Ok();
        }

        [HttpPatch]
        [Authorize]
        public async Task<IActionResult> ChangeGroupChatName([FromBody] ChangeGroupChatNameData data)
        {
            await _chatService.ChangeGroupChatName(data);
            return Ok();
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddGroupChatParticipant([FromQuery] Guid chatId, [FromQuery] Guid userId)
        {
            await _chatService.AddGroupChatParticipant(chatId, userId);
            return Ok();
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> RemoveGroupChatParticipant([FromQuery] Guid chatId, [FromQuery] Guid userId)
        {
            await _chatService.RemoveGroupChatParticipant(chatId, userId);
            return Ok();
        }

        [HttpPatch]
        [Authorize]
        public async Task<IActionResult> ToggleIgnoreChat([FromQuery] Guid chatId)
        {
            await _chatService.ToggleIgnoreChat(chatId);
            return Ok();
        }

        [HttpPatch]
        [Authorize]
        public async Task<IActionResult> ToggleArchiveChat([FromQuery] Guid chatId)
        {
            await _chatService.ToggleArchiveChat(chatId);
            return Ok();
        }
    }
}
