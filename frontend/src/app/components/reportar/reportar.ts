import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-reportar',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reportar.html',
  styleUrl: './reportar.css'
})
export class ReportarComponent {

  ticket = {
    solicitante: { nombre: '', correo: '', telefono: '', departamento: '' },
    titulo: '',
    descripcion: '',
    categoria: '',
    prioridad: 'media',
    equipoAfectado: { nombre: '', ip: '' }
  };

  enviando = false;
  exito = false;
  error = '';
  ticketCreado: any = null;

  constructor(private ticketService: TicketService) {}

  enviar(): void {
    if (!this.ticket.solicitante.nombre || !this.ticket.solicitante.correo ||
        !this.ticket.titulo || !this.ticket.descripcion || !this.ticket.categoria) {
      this.error = 'Por favor complete todos los campos obligatorios.';
      return;
    }

    this.enviando = true;
    this.error = '';

    this.ticketService.createTicket(this.ticket).subscribe({
      next: (res) => {
        this.exito = true;
        this.ticketCreado = res.data;
        this.enviando = false;
        this.limpiar();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al crear el ticket. Intente nuevamente.';
        this.enviando = false;
      }
    });
  }

  limpiar(): void {
    this.ticket = {
      solicitante: { nombre: '', correo: '', telefono: '', departamento: '' },
      titulo: '',
      descripcion: '',
      categoria: '',
      prioridad: 'media',
      equipoAfectado: { nombre: '', ip: '' }
    };
  }

  nuevo(): void {
    this.exito = false;
    this.ticketCreado = null;
    this.error = '';
  }
}
