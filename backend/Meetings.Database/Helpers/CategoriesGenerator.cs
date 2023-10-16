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
                new Category() {Id = Guid.NewGuid(), Name = "Tenis"},
                new Category() {Id = Guid.NewGuid(), Name = "Tenis stołowy"},
                new Category() {Id = Guid.NewGuid(), Name = "Bilard"},
                new Category() {Id = Guid.NewGuid(), Name = "Siatkówka"},
                new Category() {Id = Guid.NewGuid(), Name = "Piłka nożna"},
                new Category() {Id = Guid.NewGuid(), Name = "Snooker"},
                new Category() {Id = Guid.NewGuid(), Name = "Wyjście na kawę"},
                new Category() {Id = Guid.NewGuid(), Name = "Szachy"},
                new Category() {Id = Guid.NewGuid(), Name = "Planszówki"},
                new Category() {Id = Guid.NewGuid(), Name = "Warcaby"},
                new Category() {Id = Guid.NewGuid(), Name = "Wyjście w góry"},
                new Category() {Id = Guid.NewGuid(), Name = "Wyjście na imprezę"},
            };

    }
}
