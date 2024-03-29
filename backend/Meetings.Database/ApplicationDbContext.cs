﻿using Meetings.Infrastructure.Helpers;
using Meetings.Models;
using Meetings.Models.Entites;
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
        public DbSet<ChatParticipant> ChatParticipants { get; set; }
        public DbSet<BlockedUser> BlockedUsers { get; set; }
        public DbSet<UserLocation> UserLocations { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<ObservedSearch> ObservedSearches { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Category>().HasData(DbSeed.AllCategories);
            builder.Entity<UserLocation>().HasData(DbSeed.AllPolishLocations);

            builder.Entity<MessageReaction>().HasOne(x => x.Author).WithMany().OnDelete(DeleteBehavior.ClientCascade);
            builder.Entity<User>().HasMany(x => x.BlockedUsers).WithOne(x => x.User).OnDelete(DeleteBehavior.ClientCascade);

            builder.Entity<UserProfile>()
                .HasOne(x => x.User)
                .WithOne(x => x.UserProfile)
                .HasForeignKey<UserProfile>(e => e.UserId)
                .IsRequired();

            builder.Entity<UserProfile>().Property(x => x.InterestsIds)
                .HasConversion<string>();

            builder.Entity<ObservedSearch>().Property(x => x.AgeRange)
                .HasConversion<string>();
        }
    }
}
