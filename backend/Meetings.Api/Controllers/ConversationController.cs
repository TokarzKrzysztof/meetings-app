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
        public async Task<IActionResult> GetConversation([FromQuery] Guid participantId)
        {
            ConversationDTO? conversation = await _conversationService.GetConversation(participantId);
            return Ok(conversation);
        } 
    }
}
