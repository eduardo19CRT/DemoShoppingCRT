import { HttpClient, HttpHeaders } from "@angular/common/http";
import { RepositorioBase } from "./repositorio-base";
import { map, Observable } from "rxjs";
import { Respuesta } from "../models/respuesta";

export class RepositorioTarjeta extends RepositorioBase {
  constructor(http: HttpClient) {
    super(http, "Tarjeta")
  }

  obtenerTarjeta(clave: string): Observable<Respuesta> {

    let ruta = `${this.ruta}/Obtener/${clave}`;
    return this.clienteHttp.get<Respuesta>(ruta).pipe(
      map((data: Respuesta) => {
        return data;
      })
    );
  }

  actualizarSaldo(uid: string, saldoAnterior: number, nuevoSaldo: number): Observable<any> {
    return this.clienteHttp.post<any>(`${this.ruta}/actualizar-saldo`, {
      uid: uid,
      saldoAnterior: saldoAnterior,
      nuevoSaldo: nuevoSaldo
    }).pipe(
      map((data: any) => data)
    );
  }


}
