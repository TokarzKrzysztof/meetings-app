using Meetings.Models;
using Meetings.Models.Entities;
using Meetings.Utils.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Linq.Expressions;
using System.Reflection.Metadata;

namespace Meetings.Database.Repositories
{
    public interface IRepository<TEntity> where TEntity : class, IEntityBase
    {
        IQueryable<TEntity> Data { get; }

        Task<TEntity> GetById(Guid id, Func<IQueryable<TEntity>, IQueryable<TEntity>> transform = null);
        Task<TEntity> TryGetById(Guid id);
        Task Remove(Guid id);
        Task Remove(TEntity entity);
        Task RemovePermanently(Guid id);
        Task RemovePermanently(TEntity entity);
        Task Update(TEntity entity);
        TEntity Attach(TEntity entityData);
        Task UpdateRange(IEnumerable<TEntity> entities);
        Task<TEntity> Create(TEntity entity, Expression<Func<TEntity, object>>? includeReference = null);
        Task SwapRange<TKey>(IEnumerable<TEntity> dbData, IEnumerable<TEntity> newData, Func<TEntity, TKey> keySelector, bool shouldUpdate = false);
    }

    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class, IEntityBase
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

        public TEntity Attach(TEntity entityData)
        {
            return _db.Attach(entityData).Entity;
        }

        public async Task<TEntity> GetById(Guid id, Func<IQueryable<TEntity>, IQueryable<TEntity>> transform = null)
        {
            TEntity item = await Data.If(transform != null, transform).SingleAsync(x => x.Id == id);
            return item;
        }

        public async Task<TEntity?> TryGetById(Guid id)
        {
            TEntity? item = await Data.SingleOrDefaultAsync(x => x.Id == id);
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
            AssignUpdateProperties(entity);
            _db.Update(entity);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateRange(IEnumerable<TEntity> entities)
        {
            foreach (var entity in entities)
            {
                AssignUpdateProperties(entity);
            }
            _db.UpdateRange(entities);
            await _db.SaveChangesAsync();
        }

        public async Task<TEntity> Create(TEntity entity, Expression<Func<TEntity, object>>? includeReference = null)
        {
            AssignCreateProperties(entity);

            _db.Add(entity);
            await _db.SaveChangesAsync();

            if (includeReference != null)
            {
                await _db.Entry(entity).Reference(includeReference).LoadAsync();
            }

            return entity;
        }

        public async Task SwapRange<TKey>(IEnumerable<TEntity> dbData, IEnumerable<TEntity> newData, Func<TEntity, TKey> keySelector, bool shouldUpdate = false)
        {
            var toRemove = dbData.ExceptBy(newData.Select(keySelector), keySelector);
            _db.RemoveRange(toRemove);

            var toAdd = newData.ExceptBy(dbData.Select(keySelector), keySelector);
            foreach (TEntity entity in toAdd)
            {
                AssignCreateProperties(entity);
            }
            _db.AddRange(toAdd);

            if (shouldUpdate)
            {
                var toUpdate = dbData.IntersectBy(newData.Select(keySelector), keySelector);
                foreach (TEntity entity in toUpdate)
                {
                    AssignUpdateProperties(entity);
                }
                _db.UpdateRange(toUpdate);
            }

            await _db.SaveChangesAsync();
        }

        private void AssignCreateProperties(TEntity entity)
        {
            entity.Id = entity.Id == Guid.Empty ? Guid.NewGuid() : entity.Id;
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
        }

        private void AssignUpdateProperties(TEntity entity)
        {
            entity.UpdatedAt = DateTime.UtcNow;
        }
    }
}
