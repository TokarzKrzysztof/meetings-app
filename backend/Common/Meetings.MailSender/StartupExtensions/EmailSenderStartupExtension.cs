using Meetings.EmailSender;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Text;

namespace Meetings.Authentication.StartupExtensions
{
    public static class EmailSenderStartupExtension
    {
        public static void AddEmailSender(this WebApplicationBuilder builder)
        {
            builder.Services.AddScoped<IEmailSender, EmailSender.EmailSender>();
        }
    }
}
