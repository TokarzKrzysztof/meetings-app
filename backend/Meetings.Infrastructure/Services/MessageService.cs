using Meetings.Authentication.Services;
using Meetings.Database.QueryExtensions;
using Meetings.Database.Repositories;
using Meetings.FileManager;
using Meetings.Infrastructure.Hubs;
using Meetings.Infrastructure.Mappers;
using Meetings.Infrastructure.Validators;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Meetings.Infrastructure.Services
{
    public class MessageService
    {
        private readonly IRepository<Message> _repository;
        private readonly IRepository<ChatParticipant> _chatParticipantRepository;
        private readonly IClaimsReader _claimsReader;
        private readonly IHubContext<ChatHub, IChatHub> _chatHubContext;
        private readonly ExtendedMapper _extendedMapper;
        private readonly IFileManager _fileManager;
        private readonly ChatValidator _chatValidator;

        public MessageService(IClaimsReader claimsReader,
                              IRepository<Message> repository,
                              IHubContext<ChatHub, IChatHub> chatHubContext,
                              IRepository<ChatParticipant> chatParticipantRepository,
                              ExtendedMapper extendedMapper,
                              IFileManager fileManager,
                              ChatValidator chatValidator)
        {
            _repository = repository;
            _claimsReader = claimsReader;
            _chatHubContext = chatHubContext;
            _chatParticipantRepository = chatParticipantRepository;
            _extendedMapper = extendedMapper;
            _fileManager = fileManager;
            _chatValidator = chatValidator;
        }

        public async Task<List<MessageDTO>> LoadChatMessages(Guid chatId, int skip, int take)
        {
            var messages = await _repository.Data
                .Where(x => x.ChatId == chatId)
                .IncludeAllMessagesData()
                .OrderByDescending(x => x.CreatedAt)
                .Skip(skip)
                .Take(take)
                .Reverse()
                .ToListAsync();

            return _extendedMapper.ToMessageDTOList(messages);
        }

        public async Task<List<MessageDTO>> LoadAllMessagesAfterDate(Guid chatId, DateTime afterDate)
        {
            var messages = await _repository.Data
                .Where(x => x.ChatId == chatId && x.CreatedAt >= afterDate)
                .IncludeAllMessagesData()
                .OrderByDescending(x => x.CreatedAt)
                .Reverse()
                .ToListAsync();

            return _extendedMapper.ToMessageDTOList(messages);
        }

        public async Task SendMessage(SendMessageData data)
        {
            await _chatValidator.WhenSendMessage(data);

            Guid authorId = _claimsReader.GetCurrentUserId();

            Message entity = await CreateMessage(authorId, data.ChatId, data);

            await NotifyAboutNewMessage(entity);
        }

        public async Task SendInfoMessage(Guid chatId, string info)
        {
            Guid authorId = _claimsReader.GetCurrentUserId();
            Message entity = await _repository.Create(new Message()
            {
                AuthorId = authorId,
                ChatId = chatId,
                Value = info,
                Type = MessageType.Info,
            });

            await NotifyAboutNewMessage(entity);
        }

        public async Task<List<MessageDTO>> GetAllImageMessages(Guid chatId)
        {
            await _chatValidator.WhenGetAllImageMessages(chatId);

            var messages = await _repository.Data.Where(x => x.ChatId == chatId && x.Type == MessageType.Image)
                .OrderBy(x => x.CreatedAt).Select(x => new { x.Id, x.Value }).ToListAsync();
            return messages.Select(x => new MessageDTO() { Id = x.Id, Value = _fileManager.FilePathToSrc(x.Value)! }).ToList();
        }

        private async Task<Message> CreateMessage(Guid authorId, Guid chatId, SendMessageData data)
        {
            if (data.Type == MessageType.Text)
            {
                return await _repository.Create(new Message()
                {
                    Id = data.Id,
                    AuthorId = authorId,
                    ChatId = chatId,
                    ReplyToId = data.ReplyToId,
                    Value = data.Value!.Trim(),
                    Type = MessageType.Text,
                });
            }

            string extension = data.Type == MessageType.Image ? "jpg" : "mp3";
            var filePath = Path.Combine(_fileManager.Root, "Chats", chatId.ToString(), $"{Guid.NewGuid()}.{extension}");
            await _fileManager.Save(filePath, data.File!);

            return await _repository.Create(new Message()
            {
                Id = data.Id,
                AuthorId = authorId,
                ChatId = chatId,
                ReplyToId = data.ReplyToId,
                Value = filePath,
                Type = data.Type,
            });
        }

        private async Task NotifyAboutNewMessage(Message entity)
        {
            List<ChatParticipant> participants = await _chatParticipantRepository.Data.Where(x => x.ChatId == entity.ChatId).ToListAsync();
            participants.ForEach(x =>
            {
                if (x.UserId != entity.AuthorId)
                {
                    x.HasUnreadMessages = true;
                }
                // when new message comes, then set archived state to false for all participants
                x.IsArchived = false;
            });
            await _chatParticipantRepository.UpdateRange(participants);

            // refetch entity with required dependencies
            var message = await _repository.GetById(entity.Id, q => q.Include(x => x.ReplyTo));
            await _chatHubContext.Clients.Group(message.ChatId.ToString()).OnGetNewMessage(_extendedMapper.ToMessageDTO(message), message.ChatId);
        }
    }
}
