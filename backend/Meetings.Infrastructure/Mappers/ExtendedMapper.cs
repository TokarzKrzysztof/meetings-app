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

namespace Meetings.Infrastructure.Mappers
{
    public class ExtendedMapper
    {
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IFileManager _fileManager;
        public ExtendedMapper(IMapper mapper, IHttpContextAccessor httpContextAccessor, IFileManager fileManager)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _fileManager = fileManager;
        }

        private string FilePathToSrc(string filePath)
        {
            return filePath.Replace(_fileManager.Root, _httpContextAccessor.GetAppUrl());
        }

        public UserDTO ToUserDTO(User entity)
        {
            var result = _mapper.Map<UserDTO>(entity);
            result.ActiveStatus = UserUtils.DetermineUserActiveStatus(entity.LastActiveDate);
            if (entity.ProfileImagePath != null)
            {
                result.ProfileImageSrc = FilePathToSrc(entity.ProfileImagePath);
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
            if (result.Type == MessageType.Image || result.Type == MessageType.Audio)
            {
                result.Value = FilePathToSrc(entity.Value);
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
