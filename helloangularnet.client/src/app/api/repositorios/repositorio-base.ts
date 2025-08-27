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
        /*this._ruta = 'http://88.135.73.47:8002/' + controlador;*/
        this._ruta = 'https://localhost:44385/' + controlador;
    }
}
