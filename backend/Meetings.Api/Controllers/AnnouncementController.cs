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
        public AnnouncementController(AnnouncementService announcementService)
        {
            _announcementService = announcementService;
        }

        [HttpPost]
        public async Task<IActionResult> GetAnnouncementResultList([FromBody] LoadAnnouncementResultListParams data)
        {
            PaginatedData<AnnouncementResultListItem> result = await _announcementService.GetAnnouncementResultList(data);
            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateNewAnnouncement([FromBody] AnnouncementDTO data)
        {
            await _announcementService.CreateNewAnnouncement(data);
            return Ok();
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> EditAnnouncement([FromBody] AnnouncementDTO data)
        {
            await _announcementService.EditAnnouncement(data);
            return Ok();
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetCurrentUserAnnouncements([FromQuery] AnnoucementStatus status, [FromQuery] int skip, [FromQuery] int take)
        {
            PaginatedData<AnnouncementDTO> currentUserAnnouncements = await _announcementService.GetCurrentUserAnnouncements(status, skip, take);
            return Ok(currentUserAnnouncements);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetCurrentUserAnnouncementsCount()
        {
            AnnouncementsCount announcementsCount = await _announcementService.GetCurrentUserAnnouncementsCount();
            return Ok(announcementsCount);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetCurrentUserOccupiedCategoryIds()
        {
            List<Guid> ids = await _announcementService.GetCurrentUserOccupiedCategoryIds();
            return Ok(ids);
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
