import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { OrderDetailI } from '../models/orderDetail';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService {
  private baseUrl = 'http://localhost:4000/api/ocul/OrderDetails';
  private orderDetailsSubject = new BehaviorSubject<OrderDetailI[]>([]);
  public orderDetails$ = this.orderDetailsSubject.asObservable();

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

  // ✔ Ahora solo usa ID
  getAllOrderDetails(): Observable<OrderDetailI[]> {
    return this.http
      .get<{ orderdetails: OrderDetailI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(map(response => response.orderdetails));
  }

  // ✔ Buscar por el ID único
  getOrderDetailById(id: number): Observable<OrderDetailI> {
    return this.http
      .get<{ orderDetail: OrderDetailI }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(map(response => response.orderDetail));
  }

  createOrderDetail(orderDetail: OrderDetailI): Observable<OrderDetailI> {
    return this.http.post<OrderDetailI>(this.baseUrl, orderDetail, { headers: this.getHeaders() });
  }

  // ✔ Update por ID único
  updateOrderDetail(id: number, orderDetail: Partial<OrderDetailI>): Observable<OrderDetailI> {
    return this.http.patch<OrderDetailI>(`${this.baseUrl}/${id}`, orderDetail, { headers: this.getHeaders() });
  }

  // ✔ Delete real por ID
  deleteOrderDetail(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  // ✔ Delete lógico por ID
  deleteOrderDetailLogic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/logic`, { headers: this.getHeaders() });
  }

  updateLocalOrderDetails(orderDetails: OrderDetailI[]): void {
    this.orderDetailsSubject.next(orderDetails);
  }

  refreshOrderDetails(): void {
    this.getAllOrderDetails().subscribe(orderDetails => {
      this.orderDetailsSubject.next(orderDetails);
    });
  }
}
