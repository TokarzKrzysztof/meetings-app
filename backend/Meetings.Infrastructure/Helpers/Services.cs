using Meetings.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Helpers
{
    public interface IServices
    {
        public AnnouncementResultListService AnnouncementResultList { get; }
        public AnnouncementService Announcement { get; }
        public AuthService Auth { get; }
        public CategoryService Category { get; }
        public ChatParticipantService ChatParticipant { get; }
        public ChatService Chat { get; }
        public LocationService Location { get; }
        public MessageReactionService MessageReaction { get; }
        public MessageService Message { get; }
        public ObservedSearchService ObservedSearch { get; }
        public TempDataService TempData { get; }
        public UserProfileService UserProfile { get; }
        public UserService User { get; }
    }

    /// <summary>
    /// Class to avoid circular dependency issues
    /// </summary>
    public class Services : IServices
    {
        private readonly IServiceProvider _serviceProvider;
        public Services(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public AnnouncementResultListService AnnouncementResultList => _serviceProvider.GetRequiredService<AnnouncementResultListService>();
        public AnnouncementService Announcement => _serviceProvider.GetRequiredService<AnnouncementService>();
        public AuthService Auth => _serviceProvider.GetRequiredService<AuthService>();
        public CategoryService Category => _serviceProvider.GetRequiredService<CategoryService>();
        public ChatParticipantService ChatParticipant => _serviceProvider.GetRequiredService<ChatParticipantService>();
        public ChatService Chat => _serviceProvider.GetRequiredService<ChatService>();
        public LocationService Location => _serviceProvider.GetRequiredService<LocationService>();
        public MessageReactionService MessageReaction => _serviceProvider.GetRequiredService<MessageReactionService>();
        public MessageService Message => _serviceProvider.GetRequiredService<MessageService>();
        public ObservedSearchService ObservedSearch => _serviceProvider.GetRequiredService<ObservedSearchService>();
        public TempDataService TempData => _serviceProvider.GetRequiredService<TempDataService>();
        public UserProfileService UserProfile => _serviceProvider.GetRequiredService<UserProfileService>();
        public UserService User => _serviceProvider.GetRequiredService<UserService>();
    }
}
