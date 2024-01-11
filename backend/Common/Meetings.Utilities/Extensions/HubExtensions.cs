using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Meetings.Utilities.Extensions
{
    public static class HubExtensions
    {
        public static void SetItem<T>(this HubCallerContext context, string key, T value)
        {
            context.Items[key] = value;
        }
        public static T? GetItem<T>(this HubCallerContext context, string key)
        {
            return context.Items.ContainsKey(key) ? (T)context.Items[key] : default(T);
        }
    }
}
