namespace Meetings.Authentication
{
    public interface ITokenGenerator
    {
        string GenerateToken();
    }
}