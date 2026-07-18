import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <nav class="navbar">
        <a routerLink="/dashboard" class="navbar-brand">
          <span class="brand-icon">🖥️</span>
          <span>Help <strong>Desk</strong></span>
        </a>
        <ul class="navbar-nav">
          <li><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
          <li><a routerLink="/tickets" routerLinkActive="active">Tickets</a></li>
          <li><a routerLink="/reportar" routerLinkActive="active">Reportar</a></li>
        </ul>
        <div class="navbar-user">
          <span class="avatar">WL</span>
        </div>
      </nav>
      <main class="main-content">
        <router-outlet />
      </main>
      <footer class="site-footer">
        <p>Help Desk – Data Center &copy; 2026 | Universidad Técnica de Manabí</p>
        <p>Autor: <strong>Walter Alejandro Loor García</strong></p>
      </footer>
    </div>
  `,
  styles: []
})
export class App {
  title = 'helpdesk-frontend';
}
