using Meetings.Authentication.StartupExtensions;
using Meetings.Database.StartupExtensions;
using Meetings.ErrorHandlingMiddleware.StartupExtensions;
using Meetings.Infrastructure.StartupExtensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// custom builder extensions
builder.AddCustomAuthentication();
builder.AddDatabase();
builder.AddServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

// custom app extensions
app.AddErrorHandlingMiddleware();

app.MapControllers();

app.Run();
