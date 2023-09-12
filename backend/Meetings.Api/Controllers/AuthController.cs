using FluentValidation;
using Meetings.Api.Controllers;
using Meetings.Infrastructure.Services;
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
        private readonly IValidator<UserDTO> _userValidator;
        public AuthController(AuthService authService, IValidator<UserDTO> userValidator)
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
            var results = await _userValidator.ValidateAsync(data);
            if (!results.IsValid) throw new AppValidationException(results);

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
