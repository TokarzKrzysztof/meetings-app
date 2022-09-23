using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Database.Repositories
{
    public interface IRepository<TEntity>
    {
        IQueryable<TEntity> Data { get; }

        Task Create(TEntity entity);
        Task<TEntity?> GetById(Guid id);
        Task Remove(Guid id);
        Task Update(TEntity entity);
    }
}
