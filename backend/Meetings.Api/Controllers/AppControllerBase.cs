﻿using Microsoft.AspNetCore.Mvc;

namespace Meetings.Api.Controllers
{
    public abstract class AppControllerBase: ControllerBase
    {
        protected string GetAppUrl()
        {
            return $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
        }
    }
}
