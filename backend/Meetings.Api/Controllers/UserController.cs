using Meetings.Infrastructure.Services.Interfaces;
using Meetings.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UserResource data)
        {
            await _userService.Register(data);
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetPasswordMinLength()
        {     
            return Ok(5);
        }
    }
}
