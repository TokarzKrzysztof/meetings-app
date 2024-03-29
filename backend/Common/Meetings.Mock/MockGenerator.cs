﻿using Meetings.Database;
using Meetings.Database.Repositories;
using Meetings.Infrastructure.Services;
using Meetings.Mock.Helpers;
using Meetings.Models.Entites;
using Meetings.Models.Entities;
using Meetings.Utilities;
using Meetings.Utilities.Extensions;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Meetings.Mock
{
    public class MockGenerator
    {
        private readonly ApplicationDbContext _db;
        private readonly IRepository<UserLocation> _userLocationRepository;
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<Category> _categoryRepository;
        public MockGenerator(IRepository<UserLocation> userLocationRepository,
                             IRepository<User> userRepository,
                             IRepository<Category> categoryRepository,
                             ApplicationDbContext db)
        {
            _db = db;
            _userLocationRepository = userLocationRepository;
            _userRepository = userRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task GenerateRandomUsers(int count)
        {
            var locations = await _userLocationRepository.Data.ToListAsync();

            for (int i = 0; i < count; i++)
            {
                UserGender gender = EnumUtils.GetRandomValue<UserGender>();
                (string firstName, string lastName) = NameGenerator.Generate(gender);
                var birthDate = DateUtils.GetRandomDate(new DateTime(1980, 1, 1), new DateTime(2010, 1, 1));

                _db.Users.Add(new User()
                {
                    Id = Guid.NewGuid(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    FirstName = firstName,
                    LastName = lastName,
                    BirthDate = birthDate,
                    Email = $"{Guid.NewGuid()}@fake.com",
                    IsConfirmed = true,
                    Password = Hasher.Hash("12345"),
                    Gender = gender,
                    LocationId = locations.Random().Id,
                });
            }
            await _db.SaveChangesAsync();

            await CreateProfilesForAllUsers();
        }

        public async Task GenerateRandomAnnouncements(int count, string categoryName)
        {
            var users = await _userRepository.Data.ToListAsync();
            var category = await _categoryRepository.Data.SingleAsync(x => x.Name == categoryName);

            for (int i = 0; i < count; i++)
            {
                AnnouncementExperienceLevel level = EnumUtils.GetRandomValue<AnnouncementExperienceLevel>();

                _db.Announcements.Add(new Announcement()
                {
                    Id = Guid.NewGuid(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = category.Id,
                    UserId = users.Random().Id,
                    Status = AnnouncementStatus.Active,
                    Description = $"Opis do ogłoszenia - {categoryName}",
                    ExperienceLevel = category.HasExperienceLevel ? level : null
                });
            }
            await _db.SaveChangesAsync();
        }

        public async Task CreateProfilesForAllUsers()
        {
            var users = await _userRepository.Data.ToListAsync();
            foreach (var user in users)
            {
                if (user.UserProfileId != Guid.Empty) continue;
                var profile = new UserProfile()
                {
                    Id = Guid.NewGuid(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    UserId = user.Id
                };
                user.UserProfileId = profile.Id;
                _db.UserProfiles.Add(profile);
            }

            await _db.SaveChangesAsync();
        }
    }
}
