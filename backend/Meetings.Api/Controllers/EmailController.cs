using Meetings.Infrastructure.Helpers;
using Meetings.Infrastructure.Services;
using Meetings.Models.TempDataModels;
using Meetings.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.Api.Controllers
{

    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class EmailController : ControllerBase
    {
        private readonly UserService _userService;
        public EmailController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmAccount([FromQuery] Guid tempId)
        {
            RegisterTempData data = await _userService.ConfirmAccount(tempId);

            string redirectUrlParam = !string.IsNullOrWhiteSpace(data.RedirectUrl) ? $"&redirectUrl={data.RedirectUrl}" : "";
            return Redirect($"{Utils.GetClientUrl()}/login?isFromActivation=true{redirectUrlParam}");
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ChangeEmailAddress([FromQuery] Guid tempId)
        {
            await _userService.ChangeEmailAddress(tempId);
            return Redirect($"{Utils.GetClientUrl()}?isFromChangeEmailAddress=true");
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromQuery] Guid tempId)
        {
            return Redirect($"{Utils.GetClientUrl()}/reset-password?tempId={tempId}");
        }
    }
}
