using Meetings.Infrastructure.Helpers;
using Meetings.Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CategoryController : ControllerBase
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
