using AutoMapper;
using Meetings.Database.Repositories;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Meetings.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Services
{
    public class CategoryService
    {
        private readonly IRepository<Category> _repository;
        private readonly IMapper _mapper;
        public CategoryService(IRepository<Category> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<CategoryDTO>> GetAllCategories()
        {
            var categories = await _repository.Data.ToListAsync();
            return _mapper.Map<List<CategoryDTO>>(categories);
        }

        public async Task<CategoryDTO> GetCategory(Guid id)
        {
            var category = await _repository.GetById(id);
            return _mapper.Map<CategoryDTO>(category);
        }
    }
}
