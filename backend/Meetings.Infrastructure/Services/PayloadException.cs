using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Services
{
    internal class PayloadException: Exception
    {
        public PayloadException(string fieldName)
        {

        }
    }
}
