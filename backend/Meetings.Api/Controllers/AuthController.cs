using Meetings.Infrastructure.Services.Interfaces;
using Meetings.Models.Resources;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginCredentials data)
        {
            string token = await _authService.Login(data);
            return Ok(token);
        }
    }
}
