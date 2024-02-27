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
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly ChatService _chatService;
        public ChatController(ChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPrivateChat([FromQuery] Guid participantId)
        {
            ChatDTO? chat = await _chatService.GetPrivateChat(participantId);
            return Ok(chat);
        }

        [HttpGet]
        public async Task<IActionResult> GetGroupChat([FromQuery] Guid chatId)
        {
            ChatDTO chat = await _chatService.GetGroupChat(chatId);
            return Ok(chat);
        }

        [HttpPost]
        public async Task<IActionResult> GetCurrentUserChats([FromBody] GetCurrentUserChatsData data)
        {
            PaginatedData<ChatPreview> chats = await _chatService.GetCurrentUserChats(data);
            return Ok(chats);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePrivateChat([FromBody] CreatePrivateChatData data)
        {
            ChatDTO chat = await _chatService.CreatePrivateChat(data);
            return Ok(chat);
        }

        [HttpPost]
        public async Task<IActionResult> CreateGroupChat([FromBody] CreateGroupChatData data)
        {
            Guid chatId = await _chatService.CreateGroupChat(data);
            return Ok(chatId);
        }

        [HttpPatch]
        public async Task<IActionResult> ChangeGroupChatName([FromBody] ChangeGroupChatNameData data)
        {
            await _chatService.ChangeGroupChatName(data);
            return Ok();
        }
    }
}
