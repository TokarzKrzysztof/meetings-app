using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.EmailTemplates.Views
{
    public record NewAnnouncementNotificationModel(string ButtonUrl, int NewAnnouncementsCount, string CategoryName);
}
