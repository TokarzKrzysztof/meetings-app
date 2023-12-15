using Meetings.Infrastructure.Hubs;
using Meetings.Infrastructure.Services;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
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
        private readonly IHubContext<ChatHub, IChatHub> _chatHubContext;
        public ChatController(ChatService chatService, IHubContext<ChatHub, IChatHub> chatHubContext)
        {
            _chatService = chatService;
            _chatHubContext = chatHubContext;
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

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> LoadChatMessages([FromQuery] Guid chatId, [FromQuery] int skip, [FromQuery] int take)
        {
            List<MessageDTO> messages = await _chatService.LoadChatMessages(chatId, skip, take);
            return Ok(messages);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> LoadAllMessagesAfterDate([FromQuery] Guid chatId, [FromQuery] DateTime afterDate)
        {
            List<MessageDTO> messages = await _chatService.LoadAllMessagesAfterDate(chatId, afterDate);
            return Ok(messages);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetCurrentUserChats([FromQuery] ChatType type)
        {
            IEnumerable<ChatPreview> chats = await _chatService.GetCurrentUserChats(type);
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
        public async Task<IActionResult> SendMessage([FromForm] SendMessageData data)
        {
            MessageDTO message = await _chatService.SendMessage(data);
            await _chatHubContext.Clients.Group(message.ChatId.ToString()).OnGetNewMessage(message, message.ChatId);

            return Ok(message);
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

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> EditGroupChat([FromBody] EditGroupChatData data)
        {
            await _chatService.EditGroupChat(data);
            return Ok();
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> LeaveGroupChat([FromQuery] Guid chatId)
        {
            await _chatService.LeaveGroupChat(chatId);
            return Ok();
        }
    }
}
