using Meetings.Infrastructure.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.Api.Controllers
{

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        public EmailController()
        {
        }

        [HttpGet]
        public IActionResult ConfirmAccount([FromQuery] string data)
        {
            //return Redirect("http://localhost:3000/Login?isFromActivation=true");
            //return Ok(CategoriesGenerator.AllCategories);
        }
    }
}
