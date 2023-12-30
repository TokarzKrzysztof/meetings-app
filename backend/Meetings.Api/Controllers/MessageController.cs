﻿using Meetings.Infrastructure.Hubs;
using Meetings.Infrastructure.Services;
using Meetings.Models.Entities;
using Meetings.Models.Resources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Meetings.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MessageController : AppControllerBase
    {
        private readonly MessageService _messageService;
        public MessageController(MessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> LoadChatMessages([FromQuery] Guid chatId, [FromQuery] int skip, [FromQuery] int take)
        {
            List<MessageDTO> messages = await _messageService.LoadChatMessages(chatId, skip, take);
            return Ok(messages);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> LoadAllMessagesAfterDate([FromQuery] Guid chatId, [FromQuery] DateTime afterDate)
        {
            List<MessageDTO> messages = await _messageService.LoadAllMessagesAfterDate(chatId, afterDate);
            return Ok(messages);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SendMessage([FromForm] SendMessageData data)
        {
            await _messageService.SendMessage(data);
            return Ok();
        }
    }
}