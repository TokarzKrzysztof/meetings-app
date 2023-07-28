using Meetings.Models.Entities;

namespace Meetings.Authentication
{
    public interface ITokenGenerator
    {
        string GenerateToken(User user);
    }
}