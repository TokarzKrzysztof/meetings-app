using Meetings.Models;
using Microsoft.EntityFrameworkCore;

namespace Meetings.Database.Repositories
{
    public class Repository<TEntity>: IRepository<TEntity> where TEntity : EntityBase
    {
        private readonly ApplicationDbContext _db;

        public Repository(ApplicationDbContext db)
        {
            _db = db;
        }

        public IQueryable<TEntity> Data
        {
            get
            {
                return _db.Set<TEntity>().Where(x => !x.IsDelete);
            }
        }

        public async Task<TEntity?> GetById(Guid id)
        {
            TEntity? item = await Data.SingleOrDefaultAsync(x => x.Id == id);
            return item;
        }

        public async Task Remove(Guid id)
        {
            TEntity item = await Data.SingleAsync(x => x.Id == id);
            item.IsDelete = true;
            _db.Update(item);
            await _db.SaveChangesAsync();
        }

        public async Task Update(TEntity entity)
        {
            entity.UpdatedAt = DateTime.UtcNow;
            _db.Update(entity);
            await _db.SaveChangesAsync();
        }

        public async Task Create(TEntity entity)
        {
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            _db.Add(entity);
            await _db.SaveChangesAsync();
        }
    }
}
