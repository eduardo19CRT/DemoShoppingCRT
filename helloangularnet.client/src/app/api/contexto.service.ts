import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RepositorioProducto } from "./repositorios/repositorio-producto";
import { RepositorioTarjeta } from "./repositorios/repositorio-tarjeta";

@Injectable({
    providedIn: 'root',
})

export class Contexto {
  private _producto: RepositorioProducto;
  public get producto(): RepositorioProducto {
        return this._producto;
    }

  private _tarjeta: RepositorioTarjeta;
  public get tarjeta(): RepositorioTarjeta {
        return this._tarjeta;
    }
    constructor(private cliente: HttpClient){
        // this._usuarios = new RepositorioUsuario(cliente);
      this._producto = new RepositorioProducto(cliente);
      this._tarjeta = new RepositorioTarjeta(cliente);
    }
}
