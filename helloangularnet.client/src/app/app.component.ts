import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Contexto } from './api/contexto.service';

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

  productos: Producto[] = [];

  carrito: Producto[] = [];
  total: number = 0;

  constructor(private http: HttpClient, private context: Contexto) {}

  ngOnInit() {
    this.context.producto.obtenerTodos().subscribe( (res) => {
      this.productos = res.objeto
    })

  }

  agregarAlCarrito(producto: Producto) {
    this.carrito.push(producto);
    this.total += producto.precio;
  }
}
