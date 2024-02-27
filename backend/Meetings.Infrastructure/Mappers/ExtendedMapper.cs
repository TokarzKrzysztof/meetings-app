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
using Meetings.Utilities.Extensions;
using Meetings.Models.Resources;
using Meetings.Authentication.Services;
using Meetings.Infrastructure.Helpers;

namespace Meetings.Infrastructure.Mappers
{
    public class ExtendedMapper
    {
        private readonly IMapper _mapper;
        private readonly IFileManager _fileManager;
        private readonly IClaimsReader _claimsReader;
        private readonly IServices _services;
        public ExtendedMapper(IMapper mapper, IFileManager fileManager, IClaimsReader claimsReader, IServices services)
        {
            _mapper = mapper;
            _fileManager = fileManager;
            _claimsReader = claimsReader;
            _services = services;
        }

        public UserProfileDTO ToUserProfileDTO(UserProfile entity)
        {
            var result = _mapper.Map<UserProfileDTO>(entity);
            result.User = ToUserDTO(entity.User);
            result.Interests = UserProfileUtils.Interests.Where(x => entity.InterestsIds.Contains(x.Id)).ToList();

            return result;
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

        public MessageDTO ToMessageDTO(Message entity)
        {
            var result = _mapper.Map<MessageDTO>(entity);

            if (result.Type == MessageType.Image || result.Type == MessageType.Audio)
            {
                result.Value = _fileManager.FilePathToSrc(entity.Value)!;
            }
            if (entity.ReplyTo != null)
            {
                result.ReplyTo = ToMessageDTO(entity.ReplyTo);
            }

            return result;
        }

        public List<MessageDTO> ToMessageDTOList(IEnumerable<Message> entities)
        {
            var result = new List<MessageDTO>();
            foreach (var entity in entities)
            {
                result.Add(ToMessageDTO(entity));
            }
            return result;
        }
    }
}
