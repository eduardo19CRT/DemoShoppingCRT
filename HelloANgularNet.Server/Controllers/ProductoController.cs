using Master.Utilerias;
using Microsoft.AspNetCore.Mvc;
using Sorteo.Server.DTOs;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace B2B.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductoController : ControllerBase
    {


        public ProductoController(
        )
        {
        }

        [HttpGet("Obtener")]
        public async Task<ActionResult<Respuesta<List<ProductoDTO>>>> ObtenerActivos()
        {
            var productos = new List<ProductoDTO>
            {
                new ProductoDTO
                { Nombre = "Manzana", Precio = 10, Emoji = "🍎" },
                new ProductoDTO
                { Nombre = "Banana", Precio = 8, Emoji = "🍌" },
                new ProductoDTO
                { Nombre = "Uvas", Precio = 12, Emoji = "🍇" },
                new ProductoDTO
                { Nombre = "Pan", Precio = 15, Emoji = "🍞" },
                new ProductoDTO
                { Nombre = "Leche", Precio = 20, Emoji = "🥛" },
                new ProductoDTO
                { Nombre = "Queso", Precio = 25, Emoji = "🧀" },
                new ProductoDTO
                { Nombre = "Helado", Precio = 30, Emoji = "🍨" },
                new ProductoDTO
                { Nombre = "Pizza", Precio = 50, Emoji = "🍕" },
                new ProductoDTO
                { Nombre = "Hamburguesa", Precio = 45, Emoji = "🍔" }, 
                new ProductoDTO
                { Nombre = "Taco", Precio = 18, Emoji = "🌮" },

            };


            return Ok(new Respuesta<List<ProductoDTO>>
            {
                Ok = true,
                Mensaje = "Lista de productos obtenida correctamente",
                Objeto = productos
            });
        }
    }
    
}
