namespace B2B.Server.Models.Entidades
{
    public class Producto
    {
        public int Id { get; set; }
        public string Clave { get; set; }
        public string Descripcion { get; set; }
        public string Valor { get; set; }
        public string Color { get; set; }
        public bool Activo { get; set; }
    }
}
