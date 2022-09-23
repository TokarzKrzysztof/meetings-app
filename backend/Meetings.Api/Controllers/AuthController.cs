using Meetings.Models.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        public AuthController()
        {

        }
        public async Task<IActionResult> Register([FromBody] UserResource data)
        {
            return Ok();
        }
    }
}
