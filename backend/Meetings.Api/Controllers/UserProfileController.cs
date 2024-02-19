using Meetings.Infrastructure.Services;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class UserProfileController : AppControllerBase
    {
        private readonly UserProfileService _userProfileService;
        public UserProfileController(UserProfileService userProfileService)
        {
            _userProfileService = userProfileService;
        }


        [HttpGet]
        public async Task<IActionResult> GetUserProfile([FromQuery] Guid userId)
        {
            UserProfileDTO userProfile = await _userProfileService.GetUserProfile(userId);
            return Ok(userProfile);
        }

        [HttpPatch]
        public async Task<IActionResult> EditDescription([FromQuery] string? description)
        {
            await _userProfileService.EditDescription(description);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> UploadProfileImage([FromForm] IFormFile image)
        {
            await _userProfileService.UploadProfileImage(image);
            return Ok();
        }

        [HttpPatch]
        public async Task<IActionResult> EditInterests([FromQuery] string[] interests)
        {
            await _userProfileService.EditInterests(interests);
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetAvailableInterests()
        {
            string[] interests = _userProfileService.GetAvailableInterests();
            return Ok(interests);
        }
    }
}
