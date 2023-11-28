using FluentValidation;
using Meetings.Api.Controllers;
using Meetings.Infrastructure.Services;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Meetings.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.EmailTemplates.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : AppControllerBase
    {
        private readonly AuthService _authService;
        private readonly UserService _userService;
        public AuthController(AuthService authService, UserService userService)
        {
            _authService = authService;
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginCredentials data)
        {
            UserDTO user = await _authService.Login(data);
            return Ok(user);
        } 
        
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _authService.Logout();
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UserDTO data)
        {
            await _authService.Register(data);
            return Ok(data.Email);
        }

        [HttpPost]
        public async Task<IActionResult> ResendActivationLink([FromQuery] string email)
        {
            await _authService.ResendActivationLink(email);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> SendForgotPasswordEmail([FromQuery] string email)
        {
            await _authService.SendForgotPasswordEmail(email);
            return Ok();
        }  

        [HttpPatch]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordData data)
        {
            await _authService.ResetPassword(data);
            return Ok();
        }
    }
}
