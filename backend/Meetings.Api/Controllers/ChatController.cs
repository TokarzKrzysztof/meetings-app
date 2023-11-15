using Meetings.Infrastructure.Services;
using Meetings.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> GetPrivateChat([FromQuery] Guid participantId, [FromQuery] int messagesAmount)
        {
            ChatDTO? chat = await _chatService.GetPrivateChat(participantId, messagesAmount);
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
    }
}
