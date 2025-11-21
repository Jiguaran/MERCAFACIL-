import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
// Asegúrate que la ruta al modelo sea correcta
import { ShipmentI, ShipmentResponseI } from '../models/shipment'; 
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  // ATENCIÓN: Verifica que esta URL sea la correcta para tu API de Shipments
  private baseUrl = 'http://localhost:4000/api/ocul/Shipments';
  
  private shipmentsSubject = new BehaviorSubject<ShipmentResponseI[]>([]);
  public shipments$ = this.shipmentsSubject.asObservable();

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

  /**
   * Obtiene todos los envíos (activos por defecto, según la lógica de tu backend)
   */
  getAllShipments(): Observable<ShipmentResponseI[]> {
    return this.http.get<{ shipments: ShipmentResponseI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => response.shipments)
      );
  }

  /**
   * Obtiene un envío específico por su ID
   */
  getShipmentById(id: number): Observable<ShipmentResponseI> {
    return this.http.get<{ shipment: ShipmentResponseI }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.shipment)
      );
  }

  /**
   * Crea un nuevo envío
   * Usa ShipmentI como payload
   */
  createShipment(shipment: ShipmentI): Observable<ShipmentResponseI> {
    return this.http.post<ShipmentResponseI>(this.baseUrl, shipment, { headers: this.getHeaders() });
  }

  /**
   * Actualiza un envío existente
   * Usa Partial<ShipmentI> para permitir actualizaciones parciales
   */
  updateShipment(id: number, shipment: Partial<ShipmentI>): Observable<ShipmentResponseI> {
    return this.http.patch<ShipmentResponseI>(`${this.baseUrl}/${id}`, shipment, { headers: this.getHeaders() });
  }

  /**
   * Elimina un envío físicamente de la base de datos
   */
  deleteShipment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  /**
   * Realiza un borrado lógico (cambia status a INACTIVE)
   */
  deleteShipmentLogic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/logic`, { headers: this.getHeaders() });
  }

  /**
   * Actualiza el listado local de envíos en el BehaviorSubject
   */
  updateLocalShipments(shipments: ShipmentResponseI[]): void {
    this.shipmentsSubject.next(shipments);
  }

  /**
   * Refresca el listado de envíos desde la API y notifica a los suscriptores
   */
  refreshShipments(): void {
    this.getAllShipments().subscribe(shipments => {
      this.shipmentsSubject.next(shipments);
    });
  }
}