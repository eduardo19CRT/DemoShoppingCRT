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
    public class TarjetaController : ControllerBase
    {

        private readonly B2bContext _ctx;
        public TarjetaController(
            B2bContext ctx
        )
        {
            _ctx = ctx;
        }

        [HttpGet("Obtener/{uid}")]
        public async Task<ActionResult<Respuesta<TarjetaDTO>>> ObtenerTarjetaId(string uid)
        {

            var tarjeta = await _ctx.Tarjetas.FirstOrDefaultAsync( t => t.Clave == uid);

            var tarjetaDto = new TarjetaDTO
            {
                Clave = tarjeta.Clave,
                Saldo = tarjeta.Saldo
            };

            return Ok(new Respuesta<TarjetaDTO>
            {
                Ok = true,
                Mensaje = "Lista de productos obtenida correctamente",
                Objeto = tarjetaDto
            });
        }

        [HttpPost("actualizar-saldo")]
        public async Task<ActionResult> ActualizarSaldo([FromBody] ActualizarSaldoRequest request)
        {
            var tarjeta = await _ctx.Tarjetas
                .FirstOrDefaultAsync(t => t.Clave == request.Uid);

            if (tarjeta == null)
                return NotFound("Tarjeta no encontrada");

            tarjeta.Saldo = request.NuevoSaldo;

            await _ctx.SaveChangesAsync();

            return Ok(new Respuesta<TarjetaDTO>
            {
                Ok = true,
                Mensaje = "Saldo actualizado correctamente"
            });
        }
    }

    public class ActualizarSaldoRequest
    {
        public string Uid { get; set; }
        public int SaldoAnterior { get; set; }
        public int NuevoSaldo { get; set; }
    }


    
}
