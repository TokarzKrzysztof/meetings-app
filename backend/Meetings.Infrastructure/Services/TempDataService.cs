using Meetings.Database.Repositories;
using Meetings.Models.Entities;
using Meetings.Models.TempDataModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Meetings.Infrastructure.Services
{
    public class TempDataService
    {
        private readonly IRepository<TempData> _repository;

        public TempDataService(IRepository<TempData> repository)
        {
            _repository = repository;
        }

        public async Task<TempData> Create(TempData temp)
        {
            return await _repository.Create(temp);
        }

        public async Task<TempData> Get(Guid tempId)
        {
            return await _repository.GetById(tempId);
        }
        public async Task<TempData> Get(Expression<Func<TempData, bool>> where)
        {
            return await _repository.Data.Where(where).SingleAsync();
        }
    }
}
