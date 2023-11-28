using Microsoft.AspNetCore.Mvc;

namespace Meetings.Api.Controllers
{
    public abstract class AppControllerBase: ControllerBase
    {
        protected string GetClientUrl()
        {
            return "http://localhost:3000";
        }
    }
}
