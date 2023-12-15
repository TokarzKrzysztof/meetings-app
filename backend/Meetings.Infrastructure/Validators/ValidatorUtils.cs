using FluentValidation.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Validators
{
    public static class ValidatorUtils
    {
        public static void ThrowError(string errorCode)
        {
            var failures = new List<ValidationFailure>
            {
                new ValidationFailure() { ErrorCode = errorCode }
            };

            throw new FluentValidation.ValidationException(failures);
        }
    }
}
