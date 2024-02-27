using Meetings.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.HostServices
{
    public class ObservedSearchHostService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        public ObservedSearchHostService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    await scope.ServiceProvider.GetRequiredService<ObservedSearchService>().NotifyAboutNewAnnouncementsByEmail();
                }
                await Task.Delay(new TimeSpan(24, 0, 0));
            }
        }
    }
}
