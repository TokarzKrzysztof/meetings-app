using Microsoft.AspNetCore.Http;
using Meetings.Utils.Extensions;

namespace Meetings.FileManager
{
    public interface IFileManager
    {
        public string Root { get; }
        void Delete(string filePath);
        Task Save(string filePath, IFormFile file);
    }
    internal class FileManager : IFileManager
    {
        public string Root => Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

        public void Delete(string filePath)
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }

        public async Task Save(string filePath, IFormFile file)
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
    }
}
