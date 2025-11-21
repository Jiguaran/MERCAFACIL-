import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { OrderI } from '../models/order'; // Asegúrate que la ruta sea correcta
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:4000/api/ocul/Orders';
  private ordersSubject = new BehaviorSubject<OrderI[]>([]);
  public orders$ = this.ordersSubject.asObservable();

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

  getAllOrders(): Observable<OrderI[]> {
    return this.http.get<{ orders: OrderI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => response.orders)
      );
  }

  getOrderById(id: number): Observable<OrderI> {
    return this.http.get<{ order: OrderI }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.order)
      );
  }

  createOrder(order: OrderI): Observable<OrderI> {
    return this.http.post<OrderI>(this.baseUrl, order, { headers: this.getHeaders() });
  }

  updateOrder(id: number, order: OrderI): Observable<OrderI> {
    return this.http.patch<OrderI>(`${this.baseUrl}/${id}`, order, { headers: this.getHeaders() });
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  deleteOrderLogic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/logic`, { headers: this.getHeaders() });
  }

  updateLocalOrders(orders: OrderI[]): void {
    this.ordersSubject.next(orders);
  }

  refreshOrders(): void {
    this.getAllOrders().subscribe(orders => {
      this.ordersSubject.next(orders);
    });
  }
}