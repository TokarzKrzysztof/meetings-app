using Meetings.Infrastructure.Helpers;
using Meetings.Models;
using Meetings.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using System.Reflection.Metadata;

namespace Meetings.Database
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<TempData> TempDatas { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<MessageReaction> MessageReactions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Category>().HasData(CategoriesGenerator.AllCategories);
            builder.Entity<Chat>().Property(x => x.ParticipantIds)
                .HasConversion(value => string.Join(",", value), dbValue => dbValue.Split(",", StringSplitOptions.None).Select(x => new Guid(x)).ToList());
            builder.Entity<MessageReaction>().HasOne(x => x.Author).WithMany().OnDelete(DeleteBehavior.ClientCascade);
        }
    }
}
