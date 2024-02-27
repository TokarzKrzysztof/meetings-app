using Meetings.Infrastructure.Services;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Meetings.Models.Resources.Pagination;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class AnnouncementController : ControllerBase
    {
        private readonly AnnouncementService _announcementService;
        private readonly AnnouncementResultListService _announcementResultListService;
        public AnnouncementController(AnnouncementService announcementService, AnnouncementResultListService announcementResultListService)
        {
            _announcementService = announcementService;
            _announcementResultListService = announcementResultListService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> GetAnnouncementResultList([FromBody] GetAnnouncementResultListData data)
        {
            PaginatedData<AnnouncementResultListItem> result = await _announcementResultListService.GetAnnouncementResultList(data);
            return Ok(result);
        }

        [HttpPost]  
        public async Task<IActionResult> CreateNewAnnouncement([FromBody] AnnouncementDTO data)
        {
            await _announcementService.CreateNewAnnouncement(data);
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> EditAnnouncement([FromBody] AnnouncementDTO data)
        {
            await _announcementService.EditAnnouncement(data);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> GetCurrentUserAnnouncements([FromBody] GetCurrentUserAnnouncementsData data)
        {
            PaginatedData<AnnouncementDTO> currentUserAnnouncements = await _announcementService.GetCurrentUserAnnouncements(data);
            return Ok(currentUserAnnouncements);
        }

        [HttpGet]
        public async Task<IActionResult> GetCurrentUserAnnouncementsCount()
        {
            AnnouncementsCount announcementsCount = await _announcementService.GetCurrentUserAnnouncementsCount();
            return Ok(announcementsCount);
        }

        [HttpGet]
        public async Task<IActionResult> GetCurrentUserOccupiedCategoryIds()
        {
            List<Guid> ids = await _announcementService.GetCurrentUserOccupiedCategoryIds();
            return Ok(ids);
        }

        [HttpGet]
        public async Task<IActionResult> GetAnnouncement([FromQuery] Guid id)
        {
            AnnouncementDTO announcement = await _announcementService.GetAnnouncement(id);
            return Ok(announcement);
        }

        [HttpPatch]
        public async Task<IActionResult> SetAnnouncementStatus([FromBody] SetAnnouncementStatusData data)
        {
            await _announcementService.SetAnnouncementStatus(data.Id, data.NewStatus);
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveAnnouncement([FromQuery] Guid id)
        {
            await _announcementService.RemoveAnnouncement(id);
            return Ok();
        }
    }
}
