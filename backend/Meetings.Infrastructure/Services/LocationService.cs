using AutoMapper;
using Meetings.Database.Repositories;
using Meetings.FileManager;
using Meetings.Models.Entites;
using Meetings.Models.Resources;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Services
{
    public class LocationService
    {
        private readonly IRepository<UserLocation> _repository;
        private readonly IMapper _mapper;
        public LocationService(IRepository<UserLocation> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<UserLocationDTO>> GetLocations()
        {
            var data = await _repository.Data.ToListAsync();
            return _mapper.Map<List<UserLocationDTO>>(data);
        }
    }
}
