import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Contexto } from './api/contexto.service';
import { ItemCarrito } from './api/models/producto';
import { NfcService } from './api/nfc.service';
import Swal from 'sweetalert2'


interface Producto {
  nombre: string;
  precio: number;
  emoji: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {

  productos: Producto[] = [];
  cardData: string = '';
  cardUid: string = '';
  saldo: number = 0;
  carrito: ItemCarrito[] = [];
  total: number = 0;
  mostrarModal: boolean = false;
  recargar: boolean = false;
  saldoRecarga: number = 0;
  bridgeInstalled: boolean = false;

  status: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient, private context: Contexto, private nfcService: NfcService) {}

  ngOnInit() {

    this.checkBridge();

    this.context.producto.obtenerTodos().subscribe( (res) => {
      this.productos = res.objeto
    })
  }

  checkBridge() {
    this.nfcService.checkLocalBridge().subscribe({
      next: () => this.bridgeInstalled = true,
      error: () => this.bridgeInstalled = false
    });
  }

  agregarAlCarrito(producto: Producto) {
    const itemExistente = this.carrito.find(item =>
      item.producto.nombre == producto.nombre
    );

    if (itemExistente) {
      itemExistente.cantidad++;
      itemExistente.subtotal = itemExistente.producto.precio * itemExistente.cantidad;
    } else {
      this.carrito.push({
        producto: producto,
        cantidad: 1,
        subtotal: producto.precio
      });
    }

    this.calcularTotal();
  }

   aumentarCantidad(item: ItemCarrito) {
    item.cantidad++;
    item.subtotal = item.producto.precio * item.cantidad;
    this.calcularTotal();
  }

  disminuirCantidad(item: ItemCarrito) {
    if (item.cantidad > 1) {
      item.cantidad--;
      item.subtotal = item.producto.precio * item.cantidad;
    } else {
      this.eliminarDelCarrito(item);
    }
    this.calcularTotal();
  }

  eliminarDelCarrito(item: ItemCarrito) {
    const index = this.carrito.indexOf(item);
    if (index > -1) {
      this.carrito.splice(index, 1);
    }
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.carrito.reduce((sum, item) => sum + item.subtotal, 0);
  }

  pagar(){
    this.nfcService.payWithCard(this.total).subscribe({
      next: (response: any) => {

        if(!response.success){
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Saldo insuficiente",
          });
        }else{
          Swal.fire({
            icon: "success",
            title: "Ok",
            text: "Pago realizado correctamente",
          });
        }


      },
      error: (error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al leer la tarjeta",
        });
      }
    });
  }

  info(){
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  recargarSaldo(recargar: boolean){
    if(recargar){
      this.recargar = true
    }else{
      this.nfcService.topUpCard(this.saldoRecarga).subscribe({
      next: (response: any) => {
        this.leerSaldo();

      },
      error: (error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al recargar la tarjeta",
        });
      }
    });
      this.recargar = false
    }
  }

  readCard() {
    this.isLoading = true;
    this.status = 'Leyendo tarjeta...';

    this.nfcService.readCard().subscribe({
      next: (response: any) => {
        this.cardData = response;
        this.cardUid = response.uid;
        this.status = 'Tarjeta leída correctamente';
        this.isLoading = false;
        console.log(this.cardData);
        this.info();
        this.leerSaldo()

      },
      error: (error) => {
        this.status = 'Error: ' + (error.error?.error || 'Error de conexión');
        this.isLoading = false;
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al leer la tarjeta",
        });

        //TODO Quitar
        this.info();
        this.leerSaldo()
      }
    });
  }

  leerSaldo() {
    this.nfcService.getBalance().subscribe({
      next: (response: any) => {
        this.saldo = response;

      },
      error: (error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al leer la tarjeta",
        });
      }
    });
  }
}
