using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Mail;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Utilities.Extensions
{
    public static class ValidatorsExtension
    {
        public static void ValidateRequired<T>(this T data, Expression<Func<T, object?>> func) where T : class
        {
            object? value = func.Compile().Invoke(data);
            if (string.IsNullOrWhiteSpace(value?.ToString()))
            {
                throw new ValidationException($"Value of property {func.Body} in {typeof(T).Name} is required");
            }
        }

        public static void ValidateEmail<T>(this T data, Expression<Func<T, object?>> func) where T : class
        {
            object? value = func.Compile().Invoke(data);
            if (!EmailUtils.IsValidEmail(value + ""))
            {
                throw new ValidationException($"Value of property {func.Body} in {typeof(T).Name} is not valid email");
            }
        }

        public static void ValidateMin<T>(this T data, Expression<Func<T, double?>> func, double min) where T : class
        {
            object? value = func.Compile().Invoke(data);
            if (Convert.ToDouble(value) < min)
            {
                throw new ValidationException($"Value of property {func.Body} in {typeof(T).Name} is lower than {min}");
            }
        }

        public static void ValidateMax<T>(this T data, Expression<Func<T, double?>> func, double max) where T : class
        {
            object? value = func.Compile().Invoke(data);
            if (Convert.ToDouble(value) > max)
            {
                throw new ValidationException($"Value of property {func.Body} in {typeof(T).Name} is higher than {max}");
            }
        }

        public static void ValidateMinMax<T>(this T data, Expression<Func<T, double?>> func, double min, double max) where T : class
        {
            data.ValidateMin(func, min);
            data.ValidateMax(func, max);
        }

        public static void ValidateMinDate<T>(this T data, Expression<Func<T, DateTime?>> func, DateTime min) where T : class
        {
            object? value = func.Compile().Invoke(data);
            if (Convert.ToDateTime(value) < min)
            {
                throw new ValidationException($"Value of property {func.Body} in {typeof(T).Name} is lower than {min}");
            }
        }

        public static void ValidateMaxDate<T>(this T data, Expression<Func<T, DateTime?>> func, DateTime max) where T : class
        {
            object? value = func.Compile().Invoke(data);
            if (Convert.ToDateTime(value) > max)
            {
                throw new ValidationException($"Value of property {func.Body} in {typeof(T).Name} is higher than {max}");
            }
        }

        public static void ValidateMinMaxDate<T>(this T data, Expression<Func<T, DateTime?>> func, DateTime min, DateTime max) where T : class
        {
            data.ValidateMinDate(func, min);
            data.ValidateMaxDate(func, max);
        }
    }
}
