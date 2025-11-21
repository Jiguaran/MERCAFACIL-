import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { LoginI, LoginResponseI, RegisterI, RegisterResponseI} from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:4000/api';
  private tokenKey = 'auth_token';
  private authStateSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginI): Observable<LoginResponseI> {
    return this.http.post<LoginResponseI>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            this.setToken(response.token);
            this.authStateSubject.next(true);
          }
        })
      );
  }

  register(userData: RegisterI): Observable<RegisterResponseI> {
    return this.http.post<RegisterResponseI>(`${this.baseUrl}/register`, userData)
      .pipe(
        tap(response => {
          if (response.token) {
            this.setToken(response.token);
            this.authStateSubject.next(true);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authStateSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Aquí puedes agregar validación adicional del token si es necesario
    // Por ejemplo, verificar si el token no ha expirado
    return true;
  }
}