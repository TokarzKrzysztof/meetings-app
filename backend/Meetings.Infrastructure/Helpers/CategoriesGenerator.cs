using Meetings.Models.Category;
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
                new Category(Guid.NewGuid(), "Tenis"),
                new Category(Guid.NewGuid(), "Tenis stołowy"),
                new Category(Guid.NewGuid(), "Bilard"),
                new Category(Guid.NewGuid(), "Siatkówka"),
                new Category(Guid.NewGuid(), "Piłka nożna"),
                new Category(Guid.NewGuid(), "Snooker"),
                new Category(Guid.NewGuid(), "Wyjście na kawę"),
                new Category(Guid.NewGuid(), "Szachy"),
                new Category(Guid.NewGuid(), "Planszówki"),
                new Category(Guid.NewGuid(), "Warcaby"),
                new Category(Guid.NewGuid(), "Wyjście w góry"),
                new Category(Guid.NewGuid(), "Wyjście na imprezę"),
            };

    }
}
