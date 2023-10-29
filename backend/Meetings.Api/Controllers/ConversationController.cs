using Meetings.Infrastructure.Services;
using Meetings.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ConversationController : AppControllerBase
    {
        private readonly ConversationService _conversationService;
        public ConversationController(ConversationService conversationService)
        {
            _conversationService = conversationService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetConversation([FromQuery] Guid participantId, [FromQuery] bool createIfNotExist)
        {
            ConversationDTO conversation = await _conversationService.GetConversation(participantId, createIfNotExist);
            return Ok(conversation);
        } 

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetLatestConversationMessages([FromQuery] Guid conversationId, [FromQuery] DateTime? lastMessageDate)
        {
            List<MessageDTO> messages = await _conversationService.GetLatestConversationMessages(conversationId, lastMessageDate);
            return Ok(messages);
        } 
        
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SendMessage([FromBody] MessageDTO data)
        {
            await _conversationService.SendMessage(data);
            return Ok();
        }
    }
}
