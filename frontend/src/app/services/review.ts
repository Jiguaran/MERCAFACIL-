import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { ReviewI } from '../models/review'; // Asegúrate que la ruta sea correcta
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'http://localhost:4000/api/ocul/Reviews'; // Ojo: R mayúscula
  private reviewsSubject = new BehaviorSubject<ReviewI[]>([]);
  public reviews$ = this.reviewsSubject.asObservable();

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

  getAllReviews(): Observable<ReviewI[]> {
    return this.http.get<{ reviews: ReviewI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => response.reviews)
      );
  }

  getReviewById(id: number): Observable<ReviewI> {
    return this.http.get<{ review: ReviewI }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.review)
      );
  }

  createReview(review: ReviewI): Observable<ReviewI> {
    return this.http.post<ReviewI>(this.baseUrl, review, { headers: this.getHeaders() });
  }

  updateReview(id: number, review: ReviewI): Observable<ReviewI> {
    return this.http.patch<ReviewI>(`${this.baseUrl}/${id}`, review, { headers: this.getHeaders() });
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  deleteReviewLogic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/logic`, { headers: this.getHeaders() });
  }

  updateLocalReviews(reviews: ReviewI[]): void {
    this.reviewsSubject.next(reviews);
  }

  refreshReviews(): void {
    this.getAllReviews().subscribe(reviews => {
      this.reviewsSubject.next(reviews);
    });
  }
}