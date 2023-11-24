using Meetings.Infrastructure.Services;
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

namespace Meetings.Infrastructure.StartupExtensions
{
    public static class InfrastructureExtension
    {
        public static void AddInfrastructure(this WebApplicationBuilder builder)
        {
            builder.Services.AddScoped<CategoryService>();
            builder.Services.AddScoped<UserService>();
            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<AnnouncementService>();
            builder.Services.AddScoped<ChatService>();

            builder.Services.AddScoped<UserValidator>();
            builder.Services.AddScoped<AnnouncementValidator>();

            builder.Services.AddSignalR();
            builder.Services.AddSingleton<IUserIdProvider, UserIdProvider>();

            builder.Services.AddScoped<ExtendedMapper>();
            builder.Services.AddAutoMapper(typeof(MapperProfile));
        }
    }
}
