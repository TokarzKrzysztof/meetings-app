using FluentValidation;
using Meetings.Utils;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
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
                List<string> validationErrors = new List<string>();
                if (ex.GetType() == typeof(ValidationException))
                {
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    validationErrors = ((ValidationException)ex).Errors.Select(x => x.ErrorCode).ToList();
                }       
                else if (ex.GetType() == typeof(UnauthorizedAccessException))
                {
                    response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    if (ex.Message == "UserNotActive")
                    {
                        response.StatusCode = (int)HttpStatusCode.Forbidden;
                    }
                }
                else
                {
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                }

                var result = JsonSerializer.Serialize(new { statusCode = response.StatusCode, validationErrors, message = ex.Message });
                await response.WriteAsync(result);
            }
        }
    }
}
