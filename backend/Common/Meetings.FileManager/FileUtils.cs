using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Meetings.FileManager
{
    public class FileUtils
    {
        public static readonly string Root = Path.Combine(Directory.GetCurrentDirectory(), "Files");

        public static async Task Save(string filePath, IFormFile file)
        {   
            var directory = Path.GetDirectoryName(filePath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            using (FileStream stream = File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }
        }

        public static async Task<string?> GetImageBase64(string filePath)
        {
            if (!File.Exists(filePath)) return null;

            byte[] bytes = await File.ReadAllBytesAsync(filePath);
            return $"data:image/jpeg;base64, {Convert.ToBase64String(bytes)}";
        }
    }
}
