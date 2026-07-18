import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  stats: any = null;
  ticketsRecientes: any[] = [];
  loading = true;
  error = '';

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;

    // Cargar estadísticas
    this.ticketService.getStats().subscribe({
      next: (res) => {
        this.stats = res.data;
      },
      error: (err) => {
        this.error = 'Error al cargar estadísticas';
        console.error(err);
      }
    });

    // Cargar tickets recientes
    this.ticketService.getTickets({ limit: 5, sort: '-createdAt' }).subscribe({
      next: (res) => {
        this.ticketsRecientes = res.data.tickets;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar tickets';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getTotal(): number {
    return this.stats?.total || 0;
  }

  getCantidadPorEstado(estado: string): number {
    if (!this.stats?.porEstado) return 0;
    const found = this.stats.porEstado.find((e: any) => e._id === estado);
    return found ? found.cantidad : 0;
  }

  getCantidadPorPrioridad(prioridad: string): number {
    if (!this.stats?.porPrioridad) return 0;
    const found = this.stats.porPrioridad.find((p: any) => p._id === prioridad);
    return found ? found.cantidad : 0;
  }

  getBadgeClass(prioridad: string): string {
    const clases: any = {
      'critica': 'badge-danger',
      'alta':    'badge-warning',
      'media':   'badge-primary',
      'baja':    'badge-success'
    };
    return clases[prioridad] || 'badge-gray';
  }

  getEstadoBadge(estado: string): string {
    const clases: any = {
      'abierto':    'badge-gray',
      'en-proceso': 'badge-primary',
      'resuelto':   'badge-success',
      'cerrado':    'badge-success'
    };
    return clases[estado] || 'badge-gray';
  }
}
