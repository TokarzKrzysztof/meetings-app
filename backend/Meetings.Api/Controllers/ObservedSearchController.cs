using Meetings.Infrastructure.Services;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Models.Resources.Pagination;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Meetings.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class ObservedSearchController : ControllerBase
    {
        private readonly ObservedSearchService _observedSearchService;

        public ObservedSearchController(ObservedSearchService observedSearchService)
        {
            _observedSearchService = observedSearchService;
        }

        [HttpPost]
        public async Task<IActionResult> AddObservedSearch([FromBody] ObservedSearchDTO data)
        {
            await _observedSearchService.AddObservedSearch(data);
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveObservedSearch([FromQuery] Guid id)
        {
            await _observedSearchService.RemoveObservedSearch(id);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> GetCurrentUserObservedSearches([FromBody] GetCurrentUserObservedSearchesData data)
        {
            PaginatedData<ObservedSearchDTO> searches = await _observedSearchService.GetCurrentUserObservedSearches(data);
            return Ok(searches);
        }

        [HttpPost]
        public async Task<IActionResult> TryGetObservedSearchByFilters([FromBody] ResultListFilters data)
        {
            ObservedSearchDTO? observedSearch = await _observedSearchService.TryGetObservedSearchByFilters(data);
            return Ok(observedSearch);
        }

        [HttpPatch]
        public async Task<IActionResult> ToggleEmailNotification([FromQuery] Guid id)
        {
            await _observedSearchService.ToggleEmailNotification(id);
            return Ok();
        }
    }
}
