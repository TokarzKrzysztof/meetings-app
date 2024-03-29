﻿using Meetings.Infrastructure.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Meetings.Infrastructure.Mappers;
using FluentValidation;
using Meetings.Infrastructure.Validators;
using Meetings.Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;
using Meetings.Infrastructure.Helpers;
using Meetings.Infrastructure.HostServices;

namespace Meetings.Infrastructure.StartupExtensions
{
    public static class InfrastructureExtension
    {
        public static void AddInfrastructure(this WebApplicationBuilder builder)
        {
            builder.Services.AddScoped<IServices, Helpers.Services>();

            builder.Services.AddScoped<AnnouncementResultListService>();
            builder.Services.AddScoped<AnnouncementService>();
            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<CategoryService>();
            builder.Services.AddScoped<ChatParticipantService>();
            builder.Services.AddScoped<ChatService>();
            builder.Services.AddScoped<LocationService>();
            builder.Services.AddScoped<MessageReactionService>();
            builder.Services.AddScoped<MessageService>();
            builder.Services.AddScoped<ObservedSearchService>();
            builder.Services.AddScoped<TempDataService>();
            builder.Services.AddScoped<UserProfileService>();
            builder.Services.AddScoped<UserService>();

            builder.Services.AddScoped<ChatValidator>();
            builder.Services.AddScoped<UserValidator>();
            builder.Services.AddScoped<AnnouncementValidator>();
            builder.Services.AddScoped<ObservedSearchValidator>();

            builder.Services.AddHostedService<ObservedSearchHostService>();

            builder.Services.AddSignalR();

            builder.Services.AddScoped<ExtendedMapper>();
            builder.Services.AddAutoMapper(typeof(MapperProfile));
        }
    }
}
