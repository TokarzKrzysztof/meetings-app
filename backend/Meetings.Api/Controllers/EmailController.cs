using Meetings.Infrastructure.Helpers;
using Meetings.Infrastructure.Services;
using Meetings.Models.TempDataModels;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.Api.Controllers
{

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmailController : AppControllerBase
    {
        private readonly UserService _userService;
        public EmailController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> ConfirmAccount([FromQuery] Guid tempId)
        {
            RegisterTempData data = await _userService.ConfirmAccount(tempId);

            string redirectUrlParam = !string.IsNullOrWhiteSpace(data.RedirectUrl) ? $"&redirectUrl={data.RedirectUrl}" : "";
            return Redirect($"{GetClientUrl()}/login?isFromActivation=true{redirectUrlParam}");
        }

        [HttpGet]
        public async Task<IActionResult> ChangeEmailAddress([FromQuery] Guid tempId)
        {
            await _userService.ChangeEmailAddress(tempId);
            return Redirect($"{GetClientUrl()}?isFromChangeEmailAddress=true");
        }

        [HttpGet]
        public async Task<IActionResult> ResetPassword([FromQuery] Guid tempId)
        {
            return Redirect($"{GetClientUrl()}/reset-password?tempId={tempId}");
        }
    }
}
