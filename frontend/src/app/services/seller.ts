import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { SellerI } from '../models/seller'; // Asegúrate que la ruta sea correcta
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private baseUrl = 'http://localhost:4000/api/ocul/Sellers';
  private sellersSubject = new BehaviorSubject<SellerI[]>([]);
  public sellers$ = this.sellersSubject.asObservable();

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

  getAllSellers(): Observable<SellerI[]> {
    return this.http.get<{ sellers: SellerI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => response.sellers)
      );
  }

  getSellerById(id: number): Observable<SellerI> {
    return this.http.get<{ seller: SellerI }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.seller)
      );
  }

  createSeller(seller: SellerI): Observable<SellerI> {
    return this.http.post<SellerI>(this.baseUrl, seller, { headers: this.getHeaders() });
  }

  updateSeller(id: number, seller: SellerI): Observable<SellerI> {
    return this.http.patch<SellerI>(`${this.baseUrl}/${id}`, seller, { headers: this.getHeaders() });
  }

  deleteSeller(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  deleteSellerLogic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/logic`, { headers: this.getHeaders() });
  }

  updateLocalSellers(sellers: SellerI[]): void {
    this.sellersSubject.next(sellers);
  }

  refreshSellers(): void {
    this.getAllSellers().subscribe(sellers => {
      this.sellersSubject.next(sellers);
    });
  }
}