import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { ProductI } from '../models/product'; // Asegúrate que la ruta sea correcta
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:4000/api/ocul/Products';
  private productsSubject = new BehaviorSubject<ProductI[]>([]);
  public products$ = this.productsSubject.asObservable();

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

  getAllProducts(): Observable<ProductI[]> {
    return this.http.get<{ products: ProductI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => response.products)
      );
  }

  getProductById(id: number): Observable<ProductI> {
    return this.http.get<{ product: ProductI }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.product)
      );
  }

  createProduct(product: ProductI): Observable<ProductI> {
    return this.http.post<ProductI>(this.baseUrl, product, { headers: this.getHeaders() });
  }

  updateProduct(id: number, product: ProductI): Observable<ProductI> {
    return this.http.patch<ProductI>(`${this.baseUrl}/${id}`, product, { headers: this.getHeaders() });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  deleteProductLogic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/logic`, { headers: this.getHeaders() });
  }

  updateLocalProducts(products: ProductI[]): void {
    this.productsSubject.next(products);
  }

  refreshProducts(): void {
    this.getAllProducts().subscribe(products => {
      this.productsSubject.next(products);
    });
  }
}