using Meetings.Models.Entities;
using Meetings.Utilities.Extensions;

namespace Meetings.Mock.Helpers
{
    public static class NameGenerator
    {
        private static List<string> MaleNames = new List<string>() { "Adam", "Karol", "Józek", "Zbyszek", "Grzesiek", "Paweł", "Mikołaj", "Piotrek", "Jarek", "Arek", "Sławek", "Maciek", "Arkadiusz", "Bartosz", "Bartek", "Bartłomiej", "Grzegorz", "Daniel", "Darek", "Dariusz", "Mariusz", "Marek", "Dawid", "Filip", "Krzysiek", "Krzysztof", "Kacper", "Kamil", "Paweł", "Damian", "Dominik", "Eryk", "Florian", "Gabriel", "Gracjan", "Jan", "Janek", "Janusz", "Józek", "Józef", "Jacek", "Konrad", "Kuba", "Ludwik", "Nikodem", "Norbert", "Robert", "Radek", "Radosław", "Wojtek", "Wojciech", "Witold", "Tomasz", "Tadek", "Tadeusz" };
        private static List<string> FemaleNames = new List<string>() { "Karolina", "Sara", "Zuzia", "Milena", "Sylwia", "Magda", "Agata", "Kasia", "Katarzyna", "Lidia", "Oliwia", "Krysia", "Paulina", "Kornelia", "Krystyna", "Marta", "Daria", "Ania", "Anka", "Danusia", "Basia", "Ewelina", "Ewa", "Gabriela", "Gabrysia", "Gosia", "Halina", "Ilona", "Iwona", "Iza", "Joanna", "Jola", "Wiola", "Julia", "Julka", "Justyna", "Kinga", "Klaudia", "Mariola", "Marzena", "Małgorzata", "Gosia", "Monika", "Natalia", "Patrycja", "Paula", "Sabina", "Renata", "Ula", "Weronika", "Wiola", "Zosia", "Łucja" };
        private static List<string> Surnames = new List<string>() { "Tokarz", "Biernat", "Syktus", "Dudka",  "Młynarczyk", "Tajduś", "Zięba", "Król", "Smaga", "Faron", "Zapała", "Pietryga", "Duda", "Bulanda", "Marcisz", "Opoka", "Kopka", "Kuziel", "Sowa", "Nędza", "Franczyk", "Franczak", "Wróbel", "Smoter", "Nowak", "Opyd", "Giza", "Czech", "Kęska", "Matląg", "Klimek", "Sopata", "Mucha", "Zając", "Turek", "Chudy", "Jasica", "Śliwa", "Zelek", "Strug", "Hutek", "Wieczorek", "Lupa", "Twaróg", "Janik", "Plata", "Trzópek", "Czop", "Stawiarz", "Odziomek", "Raczek", "Opiela", "Szewczyk", "Sołtys", "Piechówka", "Wygoda", "Wikar", "Pach", "Puch" };

        public static (string firstName, string lastName) Generate(UserGender gender)
        {
            if (gender == UserGender.Male)
            {
                return (MaleNames.Random(), Surnames.Random());
            }
            else
            {
                return (FemaleNames.Random(), Surnames.Random());
            }
        }
    }
}
