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
        public async Task<IActionResult> GetPrivateChat([FromQuery] Guid participantId, [FromQuery] int messagesAmount)
        {
            ChatDTO? chat = await _chatService.GetPrivateChat(participantId, messagesAmount);
            return Ok(chat);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetGroupChat([FromQuery] Guid chatId, [FromQuery] int messagesAmount)
        {
            ChatDTO chat = await _chatService.GetGroupChat(chatId, messagesAmount);
            return Ok(chat);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> LoadMoreChatMessages([FromQuery] Guid chatId, [FromQuery] int skip, [FromQuery] int take)
        {
            List<MessageDTO> messages = await _chatService.LoadMoreChatMessages(chatId, skip, take);
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
            int count = await _chatService.GetUnreadChatsCount();
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
        public async Task<IActionResult> SendPrivateMessage([FromForm] SendPrivateMessageData data)
        {
            MessageDTO message = await _chatService.SendPrivateMessage(data);
            await _chatHubContext.Clients.Group(message.ChatId.ToString()).OnGetNewMessage(message);

            return Ok(message);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateGroupChat([FromBody] CreateGroupChatData data)
        {
            Guid chatId = await _chatService.CreateGroupChat(data);
            return Ok(chatId);
        }
    }
}
