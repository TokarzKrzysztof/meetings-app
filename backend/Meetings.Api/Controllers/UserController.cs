using Meetings.Api.Controllers;
using Meetings.Infrastructure.Services;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.EmailTemplates.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserController : AppControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> IsEmailTaken([FromQuery] string email)
        {
            bool isTaken = await _userService.IsEmailTaken(email);
            return Ok(isTaken);
        }

        [HttpGet]
        public async Task<IActionResult> GetCurrentUser()
        {
            UserDTO? currentUser = await _userService.GetCurrentUser();
            return Ok(currentUser);
        }

        [HttpGet]
        public async Task<IActionResult> GetUser([FromQuery] Guid id)
        {
            UserDTO user = await _userService.GetUser(id);
            return Ok(user);
        }

        [HttpGet]
        public async Task<IActionResult> GetProfileImages([FromQuery] Guid[] userIds)
        {
            List<UserDTO> profileImages = await _userService.GetProfileImages(userIds);
            return Ok(profileImages.Select(x => new { x.Id, x.ProfileImage }));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UploadProfileImage([FromForm] IFormFile image)
        {
            await _userService.UploadProfileImage(image);
            return Ok();
        }

        [HttpPatch]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordData data)
        {
            await _userService.ChangePassword(data);
            return Ok();
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> ChangePersonalData([FromBody] UserDTO data)
        {
            UserDTO user = await _userService.ChangePersonalData(data);
            return Ok(user);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SendChangeEmailAddressEmail([FromBody] ChangeEmailAddressData data)
        {
            await _userService.SendChangeEmailAddressEmail(data, GetAppUrl());
            return Ok();
        }

        [HttpPatch]
        [Authorize]
        public async Task<IActionResult> SendUserActivityTick()
        {
            await _userService.SendUserActivityTick();
            return Ok();
        }
    }
}
