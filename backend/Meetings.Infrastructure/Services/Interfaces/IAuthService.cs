namespace Meetings.Infrastructure.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> Login(string email, string password);
    }
}