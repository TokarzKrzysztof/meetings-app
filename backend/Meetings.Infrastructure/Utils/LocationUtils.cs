using Meetings.Models.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Meetings.Infrastructure.Utils
{
    public static class LocationUtils
    {
        public static int GetDistanceFromLatLonInKm(UserLocation loc1, UserLocation loc2)
        {
            int R = 6371; // Radius of the earth in km
            double dLat = Deg2Rad(loc2.Lat - loc1.Lat);
            double dLon = Deg2Rad(loc2.Lng - loc1.Lng);
            double a =
              Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
              Math.Cos(Deg2Rad(loc1.Lat)) *
                Math.Cos(Deg2Rad(loc2.Lat)) *
                Math.Sin(dLon / 2) *
                Math.Sin(dLon / 2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            double d = R * c; // Distance in km

            return (int)d;
        }

        private static double Deg2Rad(double deg)
        {
            return deg * Math.PI / 180;
        }
    }
}
