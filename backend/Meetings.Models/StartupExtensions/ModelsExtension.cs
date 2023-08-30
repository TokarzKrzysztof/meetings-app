using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using Meetings.Models.Entities;
using Microsoft.AspNetCore.Builder;

namespace Meetings.Models.StartupExtensions
{
    public static class ModelsExtension
    {
        public static void AddValidators(this WebApplicationBuilder builder)
        {
            builder.Services.AddValidatorsFromAssemblyContaining<UserValidator>();
        }
    }
}
