import { HttpClient, HttpHeaders } from "@angular/common/http";
import { RepositorioBase } from "./repositorio-base";
import { map, Observable } from "rxjs";
import { Respuesta } from "../models/respuesta";

export class RepositorioProducto extends RepositorioBase {
  constructor(http: HttpClient) {
    super(http, "Producto")
  }

  obtenerTodos(): Observable<Respuesta> {
    let ruta = `${this.ruta}/Obtener`;
    return this.clienteHttp.get<Respuesta>(ruta).pipe(
      map((data: Respuesta) => {
        return data;
      })
    );
  }
}
