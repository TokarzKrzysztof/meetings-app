using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Utils
{
    public static class UserProfileUtils
    {
        public static readonly List<Interest> Interests = new List<Interest> {
            new() { Id = new Guid("2c8565e1-8309-4ca2-ba36-0c7add863b8d"), Name = "Imprezy", IconName = "celebration" },
            new() { Id = new Guid("4d4281e8-a45e-4ee0-a65a-149a58e2082a"), Name = "Książki", IconName = "menu_book" },
            new() { Id = new Guid("3fb0fa10-faa5-446f-82de-4821e47801bb"), Name = "Netflix", IconName = "live_tv" },
            new() { Id = new Guid("f3f38212-aae8-4f62-baac-ec8d1331cac0"), Name = "Kawa", IconName = "coffee" },
            new() { Id = new Guid("7e5636ff-4bfd-42a0-a668-c4f9b423ebd2"), Name = "Spotkania ze znajomymi", IconName = "people" },
            new() { Id = new Guid("53a61bce-241e-4c65-bca6-74f271b922b4"), Name = "Gry komputerowe", IconName = "computer" },
            new() { Id = new Guid("9a02d918-6bfa-48b7-a198-882e2d47c95a"), Name = "Sport", IconName = "sports" },
            new() { Id = new Guid("6edb4c82-da5b-45dc-a77a-669f110bb80a"), Name = "Gotowanie", IconName = "restaurant_menu" },
            new() { Id = new Guid("d52939fb-06c9-4aa4-9d7f-4bc95fe1962f"), Name = "Bieganie", IconName = "directions_run" },
            new() { Id = new Guid("537beec8-a6b5-4b98-ad1c-7558b03fcc40"), Name = "Fotografia", IconName = "camera_alt" },
        };
    }
}
