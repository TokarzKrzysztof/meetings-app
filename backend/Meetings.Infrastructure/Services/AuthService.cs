using Meetings.Authentication;
using Meetings.Infrastructure.Services.Interfaces;
using Meetings.Utils;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly ITokenGenerator _tokenGenerator;
        private readonly IUserService _userService;
        public AuthService(ITokenGenerator tokenGenerator, IUserService userService)
        {
            _tokenGenerator = tokenGenerator;
            _userService = userService;
        }

        public async Task<string> Login(string email, string password)
        {
            var user = await _userService.TryGetUserByEmail(email);
            if (user == null || !PasswordHasher.Verify(password, user.Password))
            {
                throw new UnauthorizedAccessException();
            }

            return _tokenGenerator.GenerateToken(user);
        }
    }
}
