using Meetings.Mock;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Mock.StartupExtensions
{
    public static class MockStartupExtensions
    {
        public static void AddMock(this WebApplicationBuilder builder)
        {
            builder.Services.AddScoped<MockGenerator>();
            builder.Services.AddScoped<DebugActions>();
        }
    }
}
