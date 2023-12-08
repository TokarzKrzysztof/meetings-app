using AutoMapper;
using Humanizer;
using Meetings.FileManager;
using Meetings.Infrastructure.Utils;
using Meetings.Models.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Meetings.Utils.Extensions;
using Meetings.Models.Resources;
using Meetings.Authentication.Services;

namespace Meetings.Infrastructure.Mappers
{
    public class ExtendedMapper
    {
        private readonly IMapper _mapper;
        private readonly IFileManager _fileManager;
        private readonly IClaimsReader _claimsReader;
        public ExtendedMapper(IMapper mapper, IFileManager fileManager, IClaimsReader claimsReader)
        {
            _mapper = mapper;
            _fileManager = fileManager;
            _claimsReader = claimsReader;
        }

        public UserDTO ToUserDTO(User entity)
        {
            var result = _mapper.Map<UserDTO>(entity);
            result.ActiveStatus = UserUtils.DetermineUserActiveStatus(entity.LastActiveDate);
            if (entity.ProfileImagePath != null)
            {
                result.ProfileImageSrc = _fileManager.FilePathToSrc(entity.ProfileImagePath);
            }

            return result;
        }

        public List<UserDTO> ToUserDTOList(IEnumerable<User> entities)
        {
            var result = new List<UserDTO>();
            foreach (var entity in entities)
            {
                result.Add(ToUserDTO(entity));
            }
            return result;
        }

        public async Task<MessageDTO> ToMessageDTO(Message entity)
        {
            var result = _mapper.Map<MessageDTO>(entity);
            result.AuthorName = $"{entity.Author.FirstName} {entity.Author.LastName}";
            if (result.Type == MessageType.Image || result.Type == MessageType.Audio)
            {
                result.Value = _fileManager.FilePathToSrc(entity.Value)!;
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
