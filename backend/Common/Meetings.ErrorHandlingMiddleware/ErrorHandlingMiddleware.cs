using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Meetings.ErrorHandlingMiddleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                var response = context.Response;
                if (ex.GetType() == typeof(ValidationException))
                {
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                }       
                if (ex.GetType() == typeof(UnauthorizedAccessException))
                {
                    response.StatusCode = (int)HttpStatusCode.Unauthorized;
                }

                var result = JsonSerializer.Serialize(new { statusCode = response.StatusCode, message = ex.Message, stackTrace = ex.StackTrace });
                await response.WriteAsync(result);
            }
        }
    }
}
