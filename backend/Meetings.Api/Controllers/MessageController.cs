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
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly MessageService _messageService;
        public MessageController(MessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpGet]     
        public async Task<IActionResult> LoadChatMessages([FromQuery] Guid chatId, [FromQuery] int skip, [FromQuery] int take)
        {
            List<MessageDTO> messages = await _messageService.LoadChatMessages(chatId, skip, take);
            return Ok(messages);
        }

        [HttpGet]
        public async Task<IActionResult> LoadAllMessagesAfterDate([FromQuery] Guid chatId, [FromQuery] DateTime afterDate)
        {
            List<MessageDTO> messages = await _messageService.LoadAllMessagesAfterDate(chatId, afterDate);
            return Ok(messages);
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromForm] SendMessageData data)
        {
            await _messageService.SendMessage(data);
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllImageMessages([FromQuery] Guid chatId)
        {
            List<MessageDTO> messages = await _messageService.GetAllImageMessages(chatId);
            return Ok(messages);
        }
    }
}
