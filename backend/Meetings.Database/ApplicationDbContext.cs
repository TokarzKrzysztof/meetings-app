using Meetings.Models;
using Meetings.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Meetings.Database
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<TempData> TempDatas { get; set; }
    }
}
