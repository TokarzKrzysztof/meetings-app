using Meetings.Infrastructure.Services.Interfaces;
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
        public async Task<IActionResult> Login([FromQuery] string email, [FromQuery] string password)
        {
            string token = await _authService.Login(email, password);
            return Ok(token);
        }
    }
}
