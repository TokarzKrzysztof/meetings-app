using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Utils.Extensions
{
    public static class ValidatorsExtension
    {
        private static object? GetPropertyValue<T>(T data, string fieldName) where T : class
        {
            var prop = data.GetType().GetProperty(fieldName);
            if (prop == null) throw new Exception($"Property {fieldName} does not exist in {typeof(T).Name}");

            object? value = prop.GetValue(data);
            return value;
        }

        public static void ValidateRequired<T>(this T data, string fieldName) where T : class
        {
            object? value = GetPropertyValue(data, fieldName);
            if (string.IsNullOrWhiteSpace(value?.ToString()))
            {
                throw new Exception($"Value of property {fieldName} in {typeof(T).Name} is required");
            }
        }

        public static void ValidateEmail<T>(this T data, string fieldName) where T : class
        {
            object? value = GetPropertyValue(data, fieldName);
            if (!EmailUtils.IsValidEmail(value + ""))
            {
                throw new Exception($"Value of property {fieldName} in {typeof(T).Name} is not valid email");
            }
        }

        public static void ValidateMin<T>(this T data, string fieldName, double min) where T : class
        {
            object? value = GetPropertyValue(data, fieldName);
            if (Convert.ToDouble(value) < min)
            {
                throw new Exception($"Value of property {fieldName} in {typeof(T).Name} is lower than {min}");
            }
        }

        public static void ValidateMax<T>(this T data, string fieldName, double max) where T : class
        {
            object? value = GetPropertyValue(data, fieldName);
            if (Convert.ToDouble(value) > max)
            {
                throw new Exception($"Value of property {fieldName} in {typeof(T).Name} is higher than {max}");
            }
        }

        public static void ValidateMinMax<T>(this T data, string fieldName, double min, double max) where T : class
        {
            data.ValidateMin(fieldName, min);
            data.ValidateMax(fieldName, max);
        }

        public static void ValidateMin<T>(this T data, string fieldName, DateTime min) where T : class
        {
            object? value = GetPropertyValue(data, fieldName);
            if (Convert.ToDateTime(value) < min)
            {
                throw new Exception($"Value of property {fieldName} in {typeof(T).Name} is lower than {min}");
            }
        }

        public static void ValidateMax<T>(this T data, string fieldName, DateTime max) where T : class
        {
            object? value = GetPropertyValue(data, fieldName);
            if (Convert.ToDateTime(value) > max)
            {
                throw new Exception($"Value of property {fieldName} in {typeof(T).Name} is higher than {max}");
            }
        }

        public static void ValidateMinMax<T>(this T data, string fieldName, DateTime min, DateTime max) where T : class
        {
            data.ValidateMin(fieldName, min);
            data.ValidateMax(fieldName, max);
        }
    }
}
