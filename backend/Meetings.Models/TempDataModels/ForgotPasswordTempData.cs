using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.TempDataModels
{
    public class ForgotPasswordTempData
    {
        public string Email { get; set; }

        public static TempData ToTemp(string email)
        {
            return new TempData()
            {
                Data1 = email,
            };
        }

        public static ForgotPasswordTempData FromTemp(TempData temp)
        {
            return new ForgotPasswordTempData()
            {
                Email = temp.Data1!,
            };
        }
    }
}
