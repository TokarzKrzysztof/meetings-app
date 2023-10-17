using Meetings.Models;
using Meetings.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Meetings.Database.Repositories
{
    public interface IRepository<TEntity>
    {
        IQueryable<TEntity> Data { get; }

        Task<TEntity> Create(TEntity entity);
        Task<TEntity?> GetById(Guid id);
        Task Remove(Guid id);
        Task Remove(TEntity entity);
        Task RemovePermanently(Guid id);
        Task RemovePermanently(TEntity entity);
        Task Update(TEntity entity);
    }

    public class Repository<TEntity> : IRepository<TEntity> where TEntity : EntityBase
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
            TEntity? item = await Data.SingleOrDefaultAsync(x => x.Id == id && !x.IsDelete);
            return item;
        }

        public async Task Remove(Guid id)
        {
            TEntity item = await Data.SingleAsync(x => x.Id == id);
            await Remove(item);
        }
        
        public async Task Remove(TEntity entity)
        {
            entity.IsDelete = true;
            _db.Update(entity);
            await _db.SaveChangesAsync();
        }
        
        public async Task RemovePermanently(Guid id)
        {
            TEntity item = await Data.SingleAsync(x => x.Id == id);
            await RemovePermanently(item);
        }    
        
        public async Task RemovePermanently(TEntity entity)
        {
            _db.Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task Update(TEntity entity)
        {
            entity.UpdatedAt = DateTime.UtcNow;
            _db.Update(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<TEntity> Create(TEntity entity)
        {
            entity.Id = Guid.NewGuid();
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            _db.Add(entity);
            await _db.SaveChangesAsync();

            return entity;
        }
    }
}
