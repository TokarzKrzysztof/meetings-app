using Meetings.Authentication.StartupExtensions;
using Meetings.Database.StartupExtensions;
using Meetings.EmailTemplates.StartupExtensions;
using Meetings.ErrorHandlingMiddleware.StartupExtensions;
using Meetings.FileManager.StartupExtensions;
using Meetings.Infrastructure.Hubs;
using Meetings.Infrastructure.StartupExtensions;
using Meetings.Models.Resources;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Newtonsoft.Json;
using System.IO;

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
builder.AddFileManager();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors();
}

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();

// custom app extensions
app.AddErrorHandlingMiddleware();

app.MapControllers();
app.MapHub<ChatHub>("/api/chat-hub");

using (var scope = app.Services.CreateScope())
{
    //using (StreamReader r = new StreamReader("StaticData/cities.json"))
    //{
    //    string json = r.ReadToEnd();
    //    List<dynamic> items = JsonConvert.DeserializeObject<List<dynamic>>(json);
    //    foreach (var item in items)
    //    {
    //        item.id = Guid.NewGuid();
    //    }

    //    string createText = JsonConvert.SerializeObject(items);
    //    File.WriteAllText("newcities.json", createText);
    //}
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
