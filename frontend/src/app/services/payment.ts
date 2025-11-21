import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { PaymentI } from '../models/payment'; // Asegúrate que la ruta sea correcta
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = 'http://localhost:4000/api/ocul/Payments';
  private paymentsSubject = new BehaviorSubject<PaymentI[]>([]);
  public payments$ = this.paymentsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getAllPayments(): Observable<PaymentI[]> {
    return this.http.get<{ payments: PaymentI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => response.payments)
      );
  }

  getPaymentById(id: number): Observable<PaymentI> {
    // Asumo que la ruta es /:id, aunque tu route/payment.ts tiene una inconsistencia (/Payment/:id)
    return this.http.get<{ payment: PaymentI }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.payment)
      );
  }

  createPayment(payment: PaymentI): Observable<PaymentI> {
    return this.http.post<PaymentI>(this.baseUrl, payment, { headers: this.getHeaders() });
  }

  updatePayment(id: number, payment: PaymentI): Observable<PaymentI> {
    return this.http.patch<PaymentI>(`${this.baseUrl}/${id}`, payment, { headers: this.getHeaders() });
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  deletePaymentLogic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/logic`, { headers: this.getHeaders() });
  }

  updateLocalPayments(payments: PaymentI[]): void {
    this.paymentsSubject.next(payments);
  }

  refreshPayments(): void {
    this.getAllPayments().subscribe(payments => {
      this.paymentsSubject.next(payments);
    });
  }
}