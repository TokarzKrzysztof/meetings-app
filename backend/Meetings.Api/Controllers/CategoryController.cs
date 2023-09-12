using Meetings.Api.Controllers;
using Meetings.Infrastructure.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.EmailTemplates.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CategoryController : AppControllerBase
    {
        public CategoryController()
        {
        }

        [HttpGet]
        public IActionResult GetAllCategories()
        {
            return Ok(CategoriesGenerator.AllCategories);
        }
    }
}
