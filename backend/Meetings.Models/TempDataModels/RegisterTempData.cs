using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.TempDataModels
{
    public class RegisterTempData
    {
        public string? RedirectUrl { get; set; }
        public Guid UserId { get; set; }

        public static TempData ToTemp(string? redirectUrl, Guid userId)
        {
            return new TempData()
            {
                Data1 = redirectUrl,
                Data2 = userId.ToString()
            };
        }

        public static RegisterTempData FromTemp(TempData temp)
        {
            return new RegisterTempData()
            {
                RedirectUrl = temp.Data1!,
                UserId = new Guid(temp.Data2!)
            };
        }
    }
}
