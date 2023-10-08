using FluentValidation;
using Meetings.Api.Controllers;
using Meetings.Infrastructure.Services;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Meetings.Utils;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.EmailTemplates.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : AppControllerBase
    {
        private readonly AuthService _authService;
        private readonly UserValidator _userValidator;
        public AuthController(AuthService authService, UserValidator userValidator)
        {
            _authService = authService;
            _userValidator = userValidator;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginCredentials data)
        {
            string token = await _authService.Login(data);
            return Ok(token);
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UserDTO data)
        {
            await _userValidator.WhenCreate(data);
            await _authService.Register(data, GetAppUrl());
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetPasswordMinLength()
        {
            return Ok(5);
        }
    }
}
