import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://helpdesk-api-0cff.onrender.com/api';

@Injectable({ providedIn: 'root' })
export class TicketService {
  constructor(private http: HttpClient) {}

  getTickets(filtros?: any): Observable<any> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(k => { if (filtros[k]) params = params.set(k, filtros[k]); });
    }
    return this.http.get<any>(`${API_URL}/tickets`, { params });
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${API_URL}/tickets/stats/resumen`);
  }

  createTicket(ticket: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/tickets`, ticket);
  }

  updateEstado(id: string, estado: string): Observable<any> {
    return this.http.patch<any>(`${API_URL}/tickets/${id}/estado`, { estado });
  }

  deleteTicket(id: string): Observable<any> {
    return this.http.delete<any>(`${API_URL}/tickets/${id}`);
  }

  getTecnicos(): Observable<any> {
    return this.http.get<any>(`${API_URL}/tecnicos`);
  }
}
