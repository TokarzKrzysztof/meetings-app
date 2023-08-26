using Meetings.Models.Resources;

namespace Meetings.Infrastructure.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> Login(LoginCredentials data);
    }
}