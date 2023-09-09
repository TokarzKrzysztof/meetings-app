using Meetings.Infrastructure.Services;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.EmailTemplates.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginCredentials data)
        {
            string token = await _authService.Login(data);
            return Ok(token);
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UserResource data)
        {
            await _authService.Register(data);
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetPasswordMinLength()
        {
            return Ok(5);
        }
    }
}
