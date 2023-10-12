﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Meetings.Models.Entities
{
    public class TempData: EntityBase
    {
        public string Data { get; set; }

        public TempData(string data)
        {
            Data = data;
        }
    }
}