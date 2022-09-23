using Meetings.Models.User;

namespace Meetings.Authentication
{
    public interface ITokenGenerator
    {
        string GenerateToken(User user);
    }
}