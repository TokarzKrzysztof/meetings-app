using Meetings.Infrastructure.Helpers;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.Api.Controllers
{

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmailController : AppControllerBase
    {
        public EmailController()
        {
        }

        [HttpGet]
        public IActionResult ConfirmAccount([FromQuery] string tempId)
        {
            return Ok();
            //return Redirect("http://localhost:3000/Login?isFromActivation=true");
            //return Ok(CategoriesGenerator.AllCategories);
        }
    }
}
