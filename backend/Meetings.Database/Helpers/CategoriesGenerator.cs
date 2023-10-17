using Meetings.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Meetings.Infrastructure.Helpers
{
    public static class CategoriesGenerator
    {
        public static readonly List<Category> AllCategories = new List<Category>()
            {
                   new Category() { Id = new Guid("1bd18285-1050-46f2-96c2-05df35c56a9c"), Name = "Bilard" },
                   new Category() { Id = new Guid("26312a46-3e5f-453e-934c-da909d6dfe19"), Name = "Szachy" },
                   new Category() { Id = new Guid("2b4793ab-5bd8-4611-a49b-0bcda4194f9d"), Name = "Wyjście na imprezę" },
                   new Category() { Id = new Guid("319e9fa3-c8b3-45b7-b1fa-d56ca4fd7969"), Name = "Snooker" },
                   new Category() { Id = new Guid("35cda0d4-6be0-49c8-8655-44a057618318"), Name = "Wyjście w góry" },
                   new Category() { Id = new Guid("889f1a69-6bf0-4b08-b0c7-3d9f73a82dd2"), Name = "Tenis stołowy" },
                   new Category() { Id = new Guid("975fcaef-e0f6-48e0-b6c0-809adcb8e4b4"), Name = "Wyjście na kawę" },
                   new Category() { Id = new Guid("9d0e7e0d-b8e7-4adb-b1cd-15f34e506d61"), Name = "Tenis" },
                   new Category() { Id = new Guid("a2037c34-53fa-444f-9a80-252839a25bbd"), Name = "Piłka nożna" },
                   new Category() { Id = new Guid("b6f5cf4f-2008-45a9-acb8-0857b1a9190b"), Name = "Warcaby" },
                   new Category() { Id = new Guid("dc7a3995-c967-4ff9-9e90-3abee528bf66"), Name = "Planszówki" },
                   new Category() { Id = new Guid("fd6cc017-d0ae-45ee-9548-a654ef50aa5d"), Name = "Siatkówka" }
            };

    }
}
