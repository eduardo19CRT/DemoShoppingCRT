import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface Producto {
  nombre: string;
  precio: number;
  emoji: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit() {
  }

  productos: Producto[] = [
    { nombre: 'Manzana', precio: 10, emoji: '🍎' },
    { nombre: 'Banana', precio: 8, emoji: '🍌' },
    { nombre: 'Uvas', precio: 12, emoji: '🍇' },
    { nombre: 'Pan', precio: 15, emoji: '🍞' },
    { nombre: 'Leche', precio: 20, emoji: '🥛' },
    { nombre: 'Queso', precio: 25, emoji: '🧀' },
    { nombre: 'Helado', precio: 30, emoji: '🍨' },
    { nombre: 'Pizza', precio: 50, emoji: '🍕' },
    { nombre: 'Hamburguesa', precio: 45, emoji: '🍔' },
    { nombre: 'Taco', precio: 18, emoji: '🌮' },
  ];

  carrito: Producto[] = [];
  total: number = 0;

  agregarAlCarrito(producto: Producto) {
    this.carrito.push(producto);
    this.total += producto.precio;
  }
}
