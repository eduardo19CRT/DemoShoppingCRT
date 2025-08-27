import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RepositorioProducto } from "./repositorios/repositorio-producto";

@Injectable({
    providedIn: 'root',
})

export class Contexto {
  private _producto: RepositorioProducto;
  public get producto(): RepositorioProducto {
        return this._producto;
    }
    constructor(private cliente: HttpClient){
        // this._usuarios = new RepositorioUsuario(cliente);
      this._producto = new RepositorioProducto(cliente);
    }
}
