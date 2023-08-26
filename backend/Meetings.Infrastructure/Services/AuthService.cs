using Meetings.Authentication;
using Meetings.Infrastructure.Services.Interfaces;
using Meetings.Models.Resources;
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

        public async Task<string> Login(LoginCredentials data)
        {
            var user = await _userService.TryGetUserByEmail(data.Email);
            if (user == null || !PasswordHasher.Verify(data.Password, user.Password))
            {
                throw new UnauthorizedAccessException();
            }

            return _tokenGenerator.GenerateToken(user);
        }
    }
}
