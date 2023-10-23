using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Models.TempDataModels
{
    public record ChangeEmailAddressTempData(string Email, Guid UserId);
}
