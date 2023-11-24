using AutoMapper;
using Humanizer;
using Meetings.FileManager;
using Meetings.Infrastructure.Utils;
using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Mappers
{
    public class ExtendedMapper
    {
        private readonly IMapper _mapper;
        public ExtendedMapper(IMapper mapper)
        {
            _mapper = mapper;
        }

        public UserDTO ToUserDTO(User entity, string? profileImage = null)
        {
            var result = _mapper.Map<UserDTO>(entity);
            result.ProfileImage = profileImage;
            result.ActiveStatus = UserUtils.DetermineUserActiveStatus(entity.LastActiveDate);

            return result;
        }

        public async Task<MessageDTO> ToMessageDTO(Message entity)
        {
            var result = _mapper.Map<MessageDTO>(entity);
            if (result.Type == MessageType.Image)
            {
                result.Value = await FileUtils.GetImageBase64(result.Value);
            }
            if (entity.ReplyTo != null)
            {
                result.ReplyTo = await ToMessageDTO(entity.ReplyTo);
            }

            return result;
        }

        public async Task<List<MessageDTO>> ToMessageDTOList(IEnumerable<Message> entities)
        {
            var result = new List<MessageDTO>();
            foreach (var entity in entities)
            {
                result.Add(await ToMessageDTO(entity));
            }
            return result;
        }
    }
}
