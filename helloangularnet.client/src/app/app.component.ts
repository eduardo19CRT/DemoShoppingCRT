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

 pagar() {
  if (this.total <= 0) {
    Swal.fire({
      icon: "warning",
      title: "Carrito vacío",
      text: "Agrega productos al carrito primero",
    });
    return;
  }

  this.isLoading = true;
  this.status = 'Procesando pago...';

  this.nfcService.payWithCard(this.total).subscribe({
    next: async (response: any) => {
      try {
        if (!response.success) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Saldo insuficiente en la tarjeta",
          });
          this.isLoading = false;
          return;
        }

        // ✅ Pago exitoso en tarjeta NFC, ahora actualizar base de datos
        this.status = 'Actualizando base de datos...';

        const nuevoSaldo = response.nuevoSaldo || (this.saldo - this.total);

        // Actualizar base de datos
        const resultadoDb = await this.actualizarSaldoEnBaseDeDatos(
          this.cardUid,
          this.saldo,
          nuevoSaldo,
          'Compra en tienda'
        );

        if (resultadoDb) {
          // ✅ Todo exitoso
          this.saldo = nuevoSaldo;
          this.carrito = []; // Vaciar carrito
          this.calcularTotal();

          Swal.fire({
            icon: "success",
            title: "¡Éxito!",
            text: "Pago realizado correctamente",
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          // ❌ Error en base de datos - revertir transacción NFC
          await this.revertirPagoNFC(this.total);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al actualizar base de datos. Transacción revertida.",
          });
        }

      } catch (error) {
        console.error('Error en proceso de pago:', error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error en el proceso de pago",
        });
      } finally {
        this.isLoading = false;
        this.status = '';
      }
    },
    error: (error) => {
      this.isLoading = false;
      this.status = '';
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al procesar el pago en la tarjeta",
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

 recargarSaldo(mostrarInput: boolean) {
  if (mostrarInput) {
    this.recargar = true;
    return;
  }

  if (this.saldoRecarga <= 0) {
    Swal.fire({
      icon: "warning",
      title: "Monto inválido",
      text: "Ingresa un monto válido para recargar",
    });
    return;
  }

  this.isLoading = true;
  this.status = 'Procesando recarga...';

  this.nfcService.topUpCard(this.saldoRecarga).subscribe({
    next: async (response: any) => {
      try {
        if (!response.success) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al recargar la tarjeta NFC",
          });
          this.isLoading = false;
          return;
        }

        // ✅ Recarga exitosa en tarjeta NFC, ahora actualizar base de datos
        this.status = 'Actualizando base de datos...';

        const nuevoSaldo = response.nuevoSaldo || (this.saldo + this.saldoRecarga);

        // Actualizar base de datos
        const resultadoDb = await this.actualizarSaldoEnBaseDeDatos(
          this.cardUid,
          this.saldo,
          nuevoSaldo,
          'Recarga de saldo'
        );

        if (resultadoDb) {
          // ✅ Todo exitoso
          this.saldo = nuevoSaldo;
          this.saldoRecarga = 0;
          this.recargar = false;

          Swal.fire({
            icon: "success",
            title: "¡Éxito!",
            text: `Recarga de $${this.saldoRecarga} realizada correctamente`,
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          // ❌ Error en base de datos - revertir recarga NFC
          await this.revertirRecargaNFC(this.saldoRecarga);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al actualizar base de datos. Recarga revertida.",
          });
        }

      } catch (error) {
        console.error('Error en proceso de recarga:', error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error en el proceso de recarga",
        });
      } finally {
        this.isLoading = false;
        this.status = '';
      }
    },
    error: (error) => {
      this.isLoading = false;
      this.status = '';
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al recargar la tarjeta",
      });
    }
  });
}

  readCard() {

    this.isLoading = true;
    this.status = 'Leyendo tarjeta...';


    this.nfcService.readCard().subscribe({
      next: async (response: any) => {
        try {
          this.cardData = response;
          this.cardUid = response.uid;
          console.log('📋 Datos de tarjeta NFC:', this.cardData);

          // Leer saldo de la base de datos
          this.status = 'Consultando saldo en base de datos...';
          const respuestaDb = await this.obtenerTarjetaDeBaseDeDatos(this.cardUid);

          if (respuestaDb.ok && respuestaDb.objeto) {
            const saldoBaseDatos = respuestaDb.objeto.saldo;
            const saldoTarjeta = response.saldo || 0; // Asumiendo que response tiene un campo saldo

            console.log(`💾 Saldo BD: ${saldoBaseDatos}, 💳 Saldo Tarjeta: ${saldoTarjeta}`);

            // Comparar saldos
            if (saldoBaseDatos !== saldoTarjeta) {
              this.status = 'Sincronizando saldos...';
              await this.sincronizarSaldos(this.cardUid, saldoTarjeta, saldoBaseDatos);
            } else {
              this.status = 'Saldos coinciden ✅';
            }

            // Actualizar el saldo en la UI con el valor de la base de datos
            this.saldo = saldoBaseDatos;
          }

          this.status = 'Tarjeta leída correctamente';
          this.isLoading = false;
          this.info();
          this.leerSaldo();

        } catch (error) {
          this.handleError(error, 'Error al procesar tarjeta');
        }
      },
      error: async (error) => {
        //this.handleError(error, 'Error al leer la tarjeta');
        // TODO Quitar
        this.info();
        // this.leerSaldo();
        await this.context.tarjeta.obtenerTarjeta('2D-ED-1E-4E').subscribe({
        next: (respuesta: any) => {
          console.log(respuesta)
          this.sincronizarSaldos('2D-ED-1E-4E', 0, respuesta.objeto.saldo)
        },
        error: (error) => {
          console.error('❌ Error al obtener tarjeta de BD:', error);

        }
      });

      }
    });
  }

  private async obtenerTarjetaDeBaseDeDatos(clave: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.context.tarjeta.obtenerTarjeta(clave).subscribe({
        next: (respuesta: any) => {
          resolve(respuesta);
        },
        error: (error) => {
          console.error('❌ Error al obtener tarjeta de BD:', error);
          reject(error);
        }
      });
    });
  }

  // Método para sincronizar saldos
 private async sincronizarSaldos(uid: string, saldoAnterior: number, nuevoSaldo: number): Promise<void> {
  try {
    this.status = `Sincronizando saldo: ${saldoAnterior} → ${nuevoSaldo}`;

    // 1. Actualizar base de datos
    const respuestaDb = await this.context.tarjeta.actualizarSaldo(
      uid, saldoAnterior, nuevoSaldo
    ).toPromise();

    if (!respuestaDb?.ok) {
      throw new Error('Error al actualizar base de datos');
    }

    // 2. Actualizar tarjeta NFC
    const resultadoNfc = await this.nfcService.sincronizarCard(nuevoSaldo).toPromise();

    if (!resultadoNfc?.success) {
      console.warn('Base de datos actualizada pero falló sincronización NFC');
    }

    console.log('Sincronización completada');

  } catch (error) {
    console.error('Error en sincronización:', error);
    throw error;
  }
}

  // Método para manejar errores
  private handleError(error: any, mensajeDefault: string) {
    this.status = 'Error: ' + (error.error?.error || mensajeDefault);
    this.isLoading = false;

    Swal.fire({
      icon: "error",
      title: "Error",
      text: mensajeDefault,
    });

    console.error('❌ Error:', error);
  }

  leerSaldo() {
  this.isLoading = true;
  this.status = 'Consultando saldo...';

  // Primero leer de la tarjeta NFC
  this.nfcService.getBalance().subscribe({
    next: async (saldoNfc: number) => {
      try {
        this.saldo = saldoNfc;

        // Luego verificar con base de datos
        if (this.cardUid) {
          this.status = 'Sincronizando con base de datos...';

          const respuestaDb = await this.obtenerTarjetaDeBaseDeDatos(this.cardUid);

          if (respuestaDb.ok && respuestaDb.objeto) {
            const saldoDb = respuestaDb.objeto.saldo;

            if (saldoDb !== saldoNfc) {
              // Sincronizar si hay diferencia
              await this.sincronizarSaldos(this.cardUid, saldoNfc, saldoDb);
              this.saldo = saldoDb;
            }
          }
        }

        this.status = '';

      } catch (error) {
        console.error('Error al sincronizar saldo:', error);
      } finally {
        this.isLoading = false;
      }
    },
    error: (error) => {
      this.isLoading = false;
      this.status = '';
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al leer el saldo de la tarjeta",
      });
    }
  });
}

  // Método para actualizar saldo en base de datos
  private async actualizarSaldoEnBaseDeDatos(
    uid: string,
    saldoAnterior: number,
    nuevoSaldo: number,
    detalles: string
  ): Promise<boolean> {
    try {
      const respuesta = await this.context.tarjeta.actualizarSaldo(
        uid,
        saldoAnterior,
        nuevoSaldo
      ).toPromise();

      return respuesta?.ok === true;
    } catch (error) {
      console.error('Error al actualizar BD:', error);
      return false;
    }
  }

  // Método para revertir pago en NFC (si falla la BD)
  private async revertirPagoNFC(monto: number): Promise<void> {
    try {
      // Implementar lógica para revertir el pago en la tarjeta NFC
      await this.nfcService.topUpCard(monto).toPromise();
      console.log('Pago revertido en tarjeta NFC');
    } catch (error) {
      console.error('Error al revertir pago NFC:', error);
    }
  }

  // Método para revertir recarga en NFC (si falla la BD)
  private async revertirRecargaNFC(monto: number): Promise<void> {
    try {
      // Implementar lógica para revertir la recarga en la tarjeta NFC
      await this.nfcService.payWithCard(monto).toPromise();
      console.log('Recarga revertida en tarjeta NFC');
    } catch (error) {
      console.error('Error al revertir recarga NFC:', error);
    }
  }
}
