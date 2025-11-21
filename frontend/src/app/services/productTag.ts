import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { ProductTagI } from '../models/productTag'; // Asegúrate que la ruta sea correcta
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ProductTagService {
  private baseUrl = 'http://localhost:4000/api/ocul/ProductTags';
  private productTagsSubject = new BehaviorSubject<ProductTagI[]>([]);
  public productTags$ = this.productTagsSubject.asObservable();

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

  getAllProductTags(): Observable<ProductTagI[]> {
    // Tu controlador devuelve "producTags"
    return this.http.get<{ producTags: ProductTagI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => response.producTags)
      );
  }

  // Clave compuesta
  getProductTagById(id_product: number, id_tag: number): Observable<ProductTagI> {
    return this.http.get<{ productTag: ProductTagI }>(`${this.baseUrl}/${id_product}/${id_tag}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.productTag)
      );
  }

  createProductTag(productTag: ProductTagI): Observable<ProductTagI> {
    return this.http.post<ProductTagI>(this.baseUrl, productTag, { headers: this.getHeaders() });
  }

  // Clave compuesta
  updateProductTag(id_product: number, id_tag: number, productTag: Partial<ProductTagI>): Observable<ProductTagI> {
    return this.http.patch<ProductTagI>(`${this.baseUrl}/${id_product}/${id_tag}`, productTag, { headers: this.getHeaders() });
  }

  // Clave compuesta
  deleteProductTag(id_product: number, id_tag: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id_product}/${id_tag}`, { headers: this.getHeaders() });
  }

  // Clave compuesta
  deleteProductTagLogic(id_product: number, id_tag: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id_product}/${id_tag}/logic`, { headers: this.getHeaders() });
  }

  updateLocalProductTags(productTags: ProductTagI[]): void {
    this.productTagsSubject.next(productTags);
  }

  refreshProductTags(): void {
    this.getAllProductTags().subscribe(productTags => {
      this.productTagsSubject.next(productTags);
    });
  }
}