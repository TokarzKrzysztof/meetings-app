using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.FileManager.StartupExtensions
{
    public static class FileManagerStartupExtensions
    {
        public static void AddFileManager(this WebApplicationBuilder builder)
        {
            builder.Services.AddScoped<IFileManager, FileManager>();
        }
    }
}
