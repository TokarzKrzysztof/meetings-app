using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RazorHtmlEmails.RazorClassLib.Services;
using System.Text;

namespace Meetings.EmailTemplates.StartupExtensions
{
    public static class EmailTemplatesStartupExtension
    {
        public static void AddEmailTemplates(this WebApplicationBuilder builder)
        {
            builder.Services.AddScoped<IRazorViewToStringRenderer, RazorViewToStringRenderer>();
        }
    }
}
