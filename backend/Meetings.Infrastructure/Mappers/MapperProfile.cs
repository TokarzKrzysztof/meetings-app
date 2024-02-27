using AutoMapper;
using Meetings.Models.Entites;
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

            CreateMap<Chat, ChatDTO>();
            CreateMap<ChatDTO, Chat>();

            CreateMap<Message, MessageDTO>();
            CreateMap<MessageDTO, Message>();

            CreateMap<MessageReaction, MessageReactionDTO>();
            CreateMap<MessageReactionDTO, MessageReaction>();

            CreateMap<UserLocation, UserLocationDTO>();
            CreateMap<UserLocationDTO, UserLocation>();

            CreateMap<UserProfile, UserProfileDTO>();
            CreateMap<UserProfileDTO, UserProfile>();

            CreateMap<ResultListFilters, ObservedSearch>();

            CreateMap<ObservedSearch, ObservedSearchDTO>();
            CreateMap<ObservedSearchDTO, ObservedSearch>();
        }
    }
}
