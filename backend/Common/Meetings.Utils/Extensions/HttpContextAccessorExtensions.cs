using Microsoft.AspNetCore.Http;

namespace Meetings.Utils.Extensions
{
    public static class HttpContextAccessorExtensions
    {
        public static string GetAppUrl(this IHttpContextAccessor accessor)
        {
            var request = accessor.HttpContext.Request;
            return $"{request.Scheme}://{request.Host}{request.PathBase}";
        }
    }
}
