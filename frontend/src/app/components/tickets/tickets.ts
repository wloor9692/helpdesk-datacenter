import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-tickets',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
export class TicketsComponent implements OnInit {

  tickets: any[] = [];
  loading = true;
  error = '';
  mensaje = '';

  // Filtros
  filtroEstado = '';
  filtroPrioridad = '';
  filtroCategoria = '';
  filtroBusqueda = '';

  // Paginación
  pagina = 1;
  totalPaginas = 1;
  total = 0;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.cargarTickets();
  }

  cargarTickets(): void {
    this.loading = true;
    const filtros: any = {
      page: this.pagina,
      limit: 10
    };
    if (this.filtroEstado)     filtros['estado']    = this.filtroEstado;
    if (this.filtroPrioridad)  filtros['prioridad'] = this.filtroPrioridad;
    if (this.filtroCategoria)  filtros['categoria'] = this.filtroCategoria;
    if (this.filtroBusqueda)   filtros['busqueda']  = this.filtroBusqueda;

    this.ticketService.getTickets(filtros).subscribe({
      next: (res) => {
        this.tickets = res.data.tickets;
        this.total = res.data.paginacion.total;
        this.totalPaginas = res.data.paginacion.totalPaginas;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los tickets';
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.pagina = 1;
    this.cargarTickets();
  }

  limpiarFiltros(): void {
    this.filtroEstado = '';
    this.filtroPrioridad = '';
    this.filtroCategoria = '';
    this.filtroBusqueda = '';
    this.pagina = 1;
    this.cargarTickets();
  }

  cambiarEstado(ticket: any, nuevoEstado: string): void {
    this.ticketService.updateEstado(ticket._id, nuevoEstado).subscribe({
      next: (res) => {
        ticket.estado = nuevoEstado;
        this.mensaje = `Ticket ${ticket.codigo} actualizado a: ${nuevoEstado}`;
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: () => {
        this.error = 'Error al actualizar el estado';
      }
    });
  }

  eliminarTicket(ticket: any): void {
    if (!confirm(`¿Eliminar el ticket ${ticket.codigo}?`)) return;
    this.ticketService.deleteTicket(ticket._id).subscribe({
      next: () => {
        this.tickets = this.tickets.filter(t => t._id !== ticket._id);
        this.mensaje = `Ticket ${ticket.codigo} eliminado`;
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: () => {
        this.error = 'Error al eliminar el ticket';
      }
    });
  }

  anteriorPagina(): void {
    if (this.pagina > 1) { this.pagina--; this.cargarTickets(); }
  }

  siguientePagina(): void {
    if (this.pagina < this.totalPaginas) { this.pagina++; this.cargarTickets(); }
  }

  getBadgeClass(prioridad: string): string {
    const c: any = { critica:'badge-danger', alta:'badge-warning', media:'badge-primary', baja:'badge-success' };
    return c[prioridad] || 'badge-gray';
  }

  getEstadoBadge(estado: string): string {
    const c: any = { 'abierto':'badge-gray', 'en-proceso':'badge-primary', 'resuelto':'badge-success', 'cerrado':'badge-success' };
    return c[estado] || 'badge-gray';
  }
}
