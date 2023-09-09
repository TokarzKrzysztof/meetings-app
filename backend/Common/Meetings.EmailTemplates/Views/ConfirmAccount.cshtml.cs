using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text.Json;

namespace Meetings.EmailTemplates.Views
{
    public record ConfirmAccountModel(string UserName, string ButtonUrl);
}
