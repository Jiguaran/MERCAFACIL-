import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { TagI } from '../models/tag'; // Asegúrate que la ruta sea correcta
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private baseUrl = 'http://localhost:4000/api/ocul/Tags';
  private tagsSubject = new BehaviorSubject<TagI[]>([]);
  public tags$ = this.tagsSubject.asObservable();

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

  getAllTags(): Observable<TagI[]> {
    return this.http.get<{ tags: TagI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => response.tags)
      );
  }

  getTagById(id: number): Observable<TagI> {
    return this.http.get<{ tag: TagI }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.tag)
      );
  }

  createTag(tag: TagI): Observable<TagI> {
    return this.http.post<TagI>(this.baseUrl, tag, { headers: this.getHeaders() });
  }

  updateTag(id: number, tag: TagI): Observable<TagI> {
    return this.http.patch<TagI>(`${this.baseUrl}/${id}`, tag, { headers: this.getHeaders() });
  }

  deleteTag(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  deleteTagLogic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/logic`, { headers: this.getHeaders() });
  }

  updateLocalTags(tags: TagI[]): void {
    this.tagsSubject.next(tags);
  }

  refreshTags(): void {
    this.getAllTags().subscribe(tags => {
      this.tagsSubject.next(tags);
    });
  }
}