import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { ClientI} from '../models/client';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = 'http://localhost:4000/api/ocul/Clientes';
  private clientsSubject = new BehaviorSubject<ClientI[]>([]);
  public clients$ = this.clientsSubject.asObservable();

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


  getAllClients(): Observable<ClientI[]> {
    return this.http.get<{ clients: ClientI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => response.clients)
      );
  }

  getClientById(id: number): Observable<ClientI> {
    return this.http.get<ClientI>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  createClient(client: ClientI): Observable<ClientI> {
    return this.http.post<ClientI>(this.baseUrl, client, { headers: this.getHeaders() });
  }

  updateClient(id: number, client: ClientI): Observable<ClientI> {
    return this.http.patch<ClientI>(`${this.baseUrl}/${id}`, client, { headers: this.getHeaders() });
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  deleteClientLogic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/logic`, { headers: this.getHeaders() });
  }

  // Método para actualizar el estado local de clientes
  updateLocalClients(clients: ClientI[]): void {
    this.clientsSubject.next(clients);
  }

  refreshClients(): void {
    this.getAllClients().subscribe(clients => {
      this.clientsSubject.next(clients);
    });
  }
}