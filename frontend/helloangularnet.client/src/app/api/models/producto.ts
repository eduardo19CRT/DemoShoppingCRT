

export interface Producto {
  nombre: string;
  precio: number;
  emoji: string;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}
