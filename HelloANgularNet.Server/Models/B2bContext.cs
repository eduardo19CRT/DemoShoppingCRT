using B2B.Server.Models.Entidades;


using Microsoft.EntityFrameworkCore;

namespace HelloANgularNet.Server.Models
{
    public class B2bContext : DbContext
    {
        public B2bContext(DbContextOptions<B2bContext> options)
            : base(options)
        {
        }

        public DbSet<Producto> Productos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

        }


    }
}
