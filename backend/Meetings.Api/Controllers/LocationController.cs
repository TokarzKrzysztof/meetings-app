using Meetings.Infrastructure.Services;
using Meetings.Models.Entites;
using Meetings.Models.Resources;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LocationController : AppControllerBase
    {
        private readonly LocationService _locationService;
        public LocationController(LocationService locationService)
        {
            _locationService = locationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetLocations()
        {
            List<UserLocationDTO> locations = await _locationService.GetLocations();
            return Ok(locations);
        }
    }
}
