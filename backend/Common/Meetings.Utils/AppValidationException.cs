using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using FluentValidation.Results;

namespace Meetings.Utils
{
    public class AppValidationException : Exception
    {
        public List<string> Errors;
        public AppValidationException(ValidationResult results)
        {
            Errors = results.Errors.Select(x => x.ErrorCode).ToList();
        }
    }
}
