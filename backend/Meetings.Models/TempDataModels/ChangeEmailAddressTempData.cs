﻿using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Meetings.Models.TempDataModels
{
    public class ChangeEmailAddressTempData
    {
        public string Email { get; set; }
        public Guid UserId { get; set; }

        public static TempData ToTemp(string email, Guid userId)
        {
            return new TempData()
            {
                Data1 = email,
                Data2 = userId.ToString()
            };
        }

        public static ChangeEmailAddressTempData FromTemp(TempData temp)
        {
            return new ChangeEmailAddressTempData()
            {
                Email = temp.Data1!,
                UserId = new Guid(temp.Data2!)
            };
        }
    }
}
