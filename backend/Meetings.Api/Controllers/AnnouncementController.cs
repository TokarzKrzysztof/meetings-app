using Meetings.Infrastructure.Services;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AnnouncementController : AppControllerBase
    {
        private readonly AnnouncementService _announcementService;
        private readonly AnnouncementValidator _announcementValidator;
        public AnnouncementController(AnnouncementService announcementService, AnnouncementValidator announcementValidator)
        {
            _announcementService = announcementService;
            _announcementValidator = announcementValidator;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateNewAnnouncement([FromBody] AnnouncementDTO data)
        {
            _announcementValidator.WhenCreate(data);
            await _announcementService.CreateNewAnnouncement(data);
            return Ok();
        }
        
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetCurrentUserAnnouncements()
        {
            List<AnnouncementDTO> currentUserAnnouncements = await _announcementService.GetCurrentUserAnnouncements();
            return Ok(currentUserAnnouncements);
        }  

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAnnouncement([FromQuery] Guid id)
        {
            AnnouncementDTO announcement = await _announcementService.GetAnnouncement(id);
            return Ok(announcement);
        }
        
        [HttpPatch]
        [Authorize]
        public async Task<IActionResult> SetAnnouncementStatus([FromBody] SetAnnouncementStatusData data)
        {
            await _announcementService.SetAnnouncementStatus(data.Id, data.NewStatus);
            return Ok();
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> RemoveAnnouncement([FromQuery] Guid id)
        {
            await _announcementService.RemoveAnnouncement(id);
            return Ok();
        }
    }
}
