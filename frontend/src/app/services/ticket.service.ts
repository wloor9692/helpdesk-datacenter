import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Ticket {
  _id?: string;
  codigo?: string;
  solicitante: {
    nombre: string;
    correo: string;
    telefono?: string;
    departamento?: string;
  };
  titulo: string;
  descripcion: string;
  categoria: string;
  prioridad: string;
  estado?: string;
  tecnicoAsignado?: {
    nombre: string;
    especialidad: string;
  };
  equipoAfectado?: {
    nombre: string;
    ip: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // GET todos los tickets con filtros opcionales
  getTickets(filtros?: any): Observable<ApiResponse> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) params = params.set(key, filtros[key]);
      });
    }
    return this.http.get<ApiResponse>(`${this.apiUrl}/tickets`, { params });
  }

  // GET ticket por ID
  getTicketById(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/tickets/${id}`);
  }

  // GET estadísticas
  getStats(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/tickets/stats/resumen`);
  }

  // POST crear ticket
  createTicket(ticket: Ticket): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/tickets`, ticket);
  }

  // PUT actualizar ticket
  updateTicket(id: string, ticket: Partial<Ticket>): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/tickets/${id}`, ticket);
  }

  // PATCH cambiar estado
  updateEstado(id: string, estado: string): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.apiUrl}/tickets/${id}/estado`, { estado });
  }

  // PATCH asignar técnico
  asignarTecnico(id: string, nombre: string, especialidad: string): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.apiUrl}/tickets/${id}/asignar`, { nombre, especialidad });
  }

  // DELETE eliminar ticket
  deleteTicket(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/tickets/${id}`);
  }

  // GET técnicos
  getTecnicos(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/tecnicos`);
  }
}
