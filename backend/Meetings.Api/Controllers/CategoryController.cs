using Meetings.Api.Controllers;
using Meetings.Infrastructure.Helpers;
using Meetings.Infrastructure.Services;
using Meetings.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.EmailTemplates.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _categoryService;
        public CategoryController(CategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllCategories()
        {
            List<CategoryDTO> categories = await _categoryService.GetAllCategories();
            return Ok(categories);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategory([FromQuery] Guid id)
        {
            CategoryDTO category = await _categoryService.GetCategory(id);
            return Ok(category);
        }
    }
}
