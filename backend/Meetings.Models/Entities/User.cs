using FluentValidation;
using FluentValidation.Validators;
using Meetings.Models.Entites;
using Meetings.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Entities
{
    public enum UserGender
    {
        Male,
        Female
    }
    public enum UserActiveStatus
    {
        Online,
        RecentlyOnline,
        Offline
    }

    public class User : IEntityBase
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsDelete { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public UserGender Gender { get; set; }
        public bool IsConfirmed { get; set; }
        public string? ProfileImagePath { get; set; }
        public DateTime LastActiveDate { get; set; }
        public Guid LocationId { get; set; }
        public virtual UserLocation Location { get; set; }   
        public Guid UserProfileId { get; set; }
        public virtual UserProfile UserProfile { get; set; }
        public virtual ICollection<Announcement> Announcements { get; set; }
        public virtual ICollection<ChatParticipant> Chats { get; set; }
        public virtual ICollection<BlockedUser> BlockedUsers { get; set; }
        public virtual ICollection<ObservedSearch> ObservedSearches { get; set; }

        public User()
        {
            if (Utils.IsDebug())
            {
                IsConfirmed = true;
            }
        }
    }

    public class UserDTO
    {
        public Guid Id { get; set; }
        public bool IsDelete { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
        public string? PasswordRepeat { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public UserGender Gender { get; set; }
        public string? ProfileImageSrc { get; set; }
        public UserActiveStatus ActiveStatus { get; set; }
        public Guid LocationId { get; set; }
    }
}
