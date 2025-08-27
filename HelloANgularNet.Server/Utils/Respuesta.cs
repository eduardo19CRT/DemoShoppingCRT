using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Master.Utilerias
{
    public class Respuesta<T>
    {
        public string Mensaje { get; set; }
        public string? CodigoError { get; set; }
        public bool Ok { get; set; }
        public T? Objeto { get; set; }
    }
}
