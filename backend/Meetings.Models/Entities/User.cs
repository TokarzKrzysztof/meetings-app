using FluentValidation;
using FluentValidation.Validators;
using Meetings.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.Entities
{
    public enum Gender
    {
        Male,
        Female
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
        public Gender Gender { get; set; }
        public bool IsActive { get; set; }
        public ICollection<Announcement> Announcements { get; set; }
    }

    public class UserDTO
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
        public string? PasswordRepeat { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public Gender Gender { get; set; }
        public string? ProfileImage { get; set; }
    }
}
