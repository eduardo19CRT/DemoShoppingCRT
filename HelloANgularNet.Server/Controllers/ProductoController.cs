using HelloANgularNet.Server.Models;
using Master.Utilerias;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sorteo.Server.DTOs;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace B2B.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductoController : ControllerBase
    {

        private readonly B2bContext _ctx;
        public ProductoController(
            B2bContext ctx
        )
        {
            _ctx = ctx;
        }

        [HttpGet("Obtener")]
        public async Task<ActionResult<Respuesta<List<ProductoDTO>>>> ObtenerActivos()
        {

            var productos = await _ctx.Productos.ToListAsync();

            var productosDto = productos.Select(c => new ProductoDTO
            {
                Nombre = c.Nombre,
                Precio = c.Precio,
                Emoji = c.Emoji
            }).ToList();

            return Ok(new Respuesta<List<ProductoDTO>>
            {
                Ok = true,
                Mensaje = "Lista de productos obtenida correctamente",
                Objeto = productosDto
            });
        }
    }
    
}
