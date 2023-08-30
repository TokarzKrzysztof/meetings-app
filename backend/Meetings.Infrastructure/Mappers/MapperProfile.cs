using AutoMapper;
using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Mappers
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<UserResource, User>();
            CreateMap<User, UserResource>().ForMember(x => x.Password, x => x.Ignore());
        }
    }
}
