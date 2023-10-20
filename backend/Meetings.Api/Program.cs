using Meetings.Authentication.StartupExtensions;
using Meetings.Database.StartupExtensions;
using Meetings.EmailSender;
using Meetings.EmailTemplates.StartupExtensions;
using Meetings.EmailTemplates.Views;
using Meetings.ErrorHandlingMiddleware.StartupExtensions;
using Meetings.Infrastructure.StartupExtensions;
using Meetings.Utils;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Razor.RuntimeCompilation;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.FileProviders;
using RazorHtmlEmails.RazorClassLib.Services;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(options =>
{
    // allow to return null from requests
    options.OutputFormatters.RemoveType<HttpNoContentOutputFormatter>();
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//services cors
builder.Services.AddCors(policyBuilder =>
    policyBuilder.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:3000")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials())
);
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
builder.Services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();

// custom builder extensions
builder.AddCustomAuthentication();
builder.AddDatabase();
builder.AddInfrastructure();
builder.AddEmailSender();
builder.AddEmailTemplates();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

// custom app extensions
app.AddErrorHandlingMiddleware();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var filesDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Files");
    if (!Directory.Exists(filesDirectory))
    {
        Directory.CreateDirectory(filesDirectory);
    }
    //IEmailSender emailS = scope.ServiceProvider.GetRequiredService<IEmailSender>();

    //var receivers = new List<EmailReceiver>()
    //{
    //    new EmailReceiver("krzysiek1472@gmail.com", "Krzysiek")
    //};
    //var hashUserId = Hasher.Hash(Guid.NewGuid().ToString());
    //var confirmAccountModel = new ConfirmAccountModel("Krzysiek", $"https://localhost:7175/api/Email/ConfirmAccount?data={hashUserId}");
    //await emailS.Send(new EmailData(receivers, "Aktywacja konta", "ConfirmAccount", confirmAccountModel));
    //Console.WriteLine(123);
}



app.Run();
