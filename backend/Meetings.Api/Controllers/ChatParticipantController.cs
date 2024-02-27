using Meetings.Infrastructure.Services;
using Meetings.Models.Resources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class ChatParticipantController : ControllerBase
    {
        private readonly ChatParticipantService _chatParticipantService;

        public ChatParticipantController(ChatParticipantService chatParticipantService)
        {
            _chatParticipantService = chatParticipantService;
        }


        [HttpGet]
        public async Task<IActionResult> GetUnreadChatsCount()
        {
            UnreadChatsCountData count = await _chatParticipantService.GetUnreadChatsCount();
            return Ok(count);
        }

        [HttpPatch]
        public async Task<IActionResult> ToggleIgnoreChat([FromQuery] Guid chatId)
        {
            await _chatParticipantService.ToggleIgnoreChat(chatId);
            return Ok();
        }

        [HttpPatch]
        public async Task<IActionResult> ToggleArchiveChat([FromQuery] Guid chatId)
        {
            await _chatParticipantService.ToggleArchiveChat(chatId);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> AddGroupChatParticipant([FromQuery] Guid chatId, [FromQuery] Guid userId)
        {
            await _chatParticipantService.AddGroupChatParticipant(chatId, userId);
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveGroupChatParticipant([FromQuery] Guid chatId, [FromQuery] Guid userId)
        {
            await _chatParticipantService.RemoveGroupChatParticipant(chatId, userId);
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> LeaveGroupChat([FromQuery] Guid chatId)
        {
            await _chatParticipantService.LeaveGroupChat(chatId);
            return Ok();
        }

        [HttpPatch]
        public async Task<IActionResult> MarkChatAsRead([FromQuery] Guid chatId)
        {
            await _chatParticipantService.MarkChatAsRead(chatId);
            return Ok();
        }
    }
}
