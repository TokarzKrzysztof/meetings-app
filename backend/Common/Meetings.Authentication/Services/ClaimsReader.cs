using Meetings.Models.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Authentication.Services
{
    public interface IClaimsReader
    {
        Guid GetCurrentUserId();
        Guid? TryGetCurrentUserId();
        string GetCurrentUserFirstName();
        UserGender GetCurrentUserGender();
    }
    internal class ClaimsReader : IClaimsReader
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ClaimsReader(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public UserGender GetCurrentUserGender()
        {
            string gender = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Gender)!;
            return Enum.Parse<UserGender>(gender);
        }

        public string GetCurrentUserFirstName()
        {
            return _httpContextAccessor.HttpContext.User.FindFirstValue(CustomClaims.FirstName)!;
        }

        public Guid GetCurrentUserId()
        {
            return (Guid)TryGetCurrentUserId();
        }
        public Guid? TryGetCurrentUserId()
        {
            IEnumerable<Claim> claims = _httpContextAccessor.HttpContext.User.Claims;
            if (!claims.Any())
            {
                // not logged in
                return null;
            }

            Guid userId = new Guid(claims.Single(x => x.Type == CustomClaims.Id).Value);
            return userId;
        }
    }
}
