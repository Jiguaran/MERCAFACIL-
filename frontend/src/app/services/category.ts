import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { CategoryI } from '../models/category'; // Asegúrate que la ruta al modelo sea correcta
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // 1. URL base actualizada para Categories
  private baseUrl = 'http://localhost:4000/api/ocul/Categories';
  
  // 2. BehaviorSubject para categories
  private categoriesSubject = new BehaviorSubject<CategoryI[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

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

  // 3. Métodos adaptados a Category
  
  getAllCategories(): Observable<CategoryI[]> {
    return this.http.get<{ categories: CategoryI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        // Mapeamos la respuesta para extraer el array 'categories'
        map(response => response.categories)
      );
  }

  getCategoryById(id: number): Observable<CategoryI> {
    return this.http.get<{ category: CategoryI }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        // Mapeamos la respuesta para extraer el objeto 'category'
        map(response => response.category)
      );
  }

  createCategory(category: CategoryI): Observable<CategoryI> {
    return this.http.post<CategoryI>(this.baseUrl, category, { headers: this.getHeaders() });
  }

  updateCategory(id: number, category: CategoryI): Observable<CategoryI> {
    return this.http.patch<CategoryI>(`${this.baseUrl}/${id}`, category, { headers: this.getHeaders() });
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  deleteCategoryLogic(id: number): Observable<void> {
    // La ruta para borrado lógico es /:id/logic
    return this.http.delete<void>(`${this.baseUrl}/${id}/logic`, { headers: this.getHeaders() });
  }

  // 4. Métodos de estado local adaptados
  
  updateLocalCategories(categories: CategoryI[]): void {
    this.categoriesSubject.next(categories);
  }

  refreshCategories(): void {
    this.getAllCategories().subscribe(categories => {
      this.categoriesSubject.next(categories);
    });
  }
}