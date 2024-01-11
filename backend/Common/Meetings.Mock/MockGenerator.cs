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

        private readonly UserService _userService;
        private readonly AuthService _authService;
        private readonly AnnouncementService _annoucementService;
        private readonly IRepository<UserLocation> _userLocationRepository;
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<Category> _categoryRepository;
        private readonly IRepository<Announcement> _announcementRepository;
        public MockGenerator(UserService userService, AuthService authService, IRepository<UserLocation> userLocationRepository, AnnouncementService annoucementService, IRepository<User> userRepository, IRepository<Category> categoryRepository, IRepository<Announcement> announcementRepository)
        {
            _userService = userService;
            _authService = authService;
            _userLocationRepository = userLocationRepository;
            _annoucementService = annoucementService;
            _userRepository = userRepository;
            _categoryRepository = categoryRepository;
            _announcementRepository = announcementRepository;
        }

        public async Task GenerateRandomUsers(int count)
        {
            var locations = await _userLocationRepository.Data.ToListAsync();

            for (int i = 0; i < count; i++)
            {
                UserGender gender = EnumUtils.GetRandomValue<UserGender>();
                (string firstName, string lastName) = NameGenerator.Generate(gender);
                var birthDate = DateUtils.GetRandomDate(new DateTime(1980, 1, 1), new DateTime(2010, 1, 1));
                await _userRepository.Create(new User()
                {
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
        }

        public async Task GenerateRandomAnnouncements(int count, string categoryName)
        {
            var users = await _userRepository.Data.ToListAsync();
            var categoryId = (await _categoryRepository.Data.FirstAsync(x => x.Name == categoryName)).Id;

            for (int i = 0; i < count; i++)
            {
                await _announcementRepository.Create(new Announcement()
                {
                    CategoryId = categoryId,
                    UserId = users.Random().Id,
                    Status = AnnoucementStatus.Active,
                    Description = $"Opis do ogłoszenia - {categoryName}",
                });
            }
        }
    }
}
