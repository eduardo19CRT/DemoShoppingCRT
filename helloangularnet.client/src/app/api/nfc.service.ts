import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NfcService {
  private apiUrl = 'http://localhost:8001';

  constructor(private http: HttpClient) { }

  readCard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/read`);
  }

  writeCard(data: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/write`, { Data: data });
  }

  getBalance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/balance`);
  }

  topUpCard(amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/topup`, { amount });
  }

  payWithCard(amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/pay`, { amount });
  }

  checkLocalBridge(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`, { responseType: 'text' });
  }
}
