import { HttpClient } from '@angular/common/http';


export abstract class RepositorioBase {
    private readonly _ruta: string;

    public get ruta(): string {
        return this._ruta;
    }

    public get clienteHttp() {
        return this.httpClient;
    }

    constructor(private httpClient: HttpClient, controlador: string) {
      //Desarrollo
      //this._ruta = 'https://localhost:44385/' + controlador;
      //Imagen Docker
      this._ruta = 'https://angularnet:44385/' + controlador;
    }
}
