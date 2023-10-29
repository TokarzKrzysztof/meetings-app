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
            CreateMap<UserDTO, User>();
            CreateMap<User, UserDTO>().ForMember(x => x.Password, x => x.Ignore());

            CreateMap<Announcement, AnnouncementDTO>();
            CreateMap<AnnouncementDTO, Announcement>();
            
            CreateMap<Category, CategoryDTO>();
            CreateMap<CategoryDTO, Category>();
            
            CreateMap<Conversation, ConversationDTO>();
            CreateMap<ConversationDTO, Conversation>();
            
            CreateMap<Message, MessageDTO>();
            CreateMap<MessageDTO, Message>();
        }
    }
}
