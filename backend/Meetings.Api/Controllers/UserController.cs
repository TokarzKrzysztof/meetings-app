using Meetings.Api.Controllers;
using Meetings.Infrastructure.Services;
using Meetings.Models.Entities;
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
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            UserDTO currentUser = await _userService.GetCurrentUser();
            return Ok(currentUser);
        }
    }
}
