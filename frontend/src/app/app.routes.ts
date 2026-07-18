import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { TicketsComponent } from './components/tickets/tickets';
import { ReportarComponent } from './components/reportar/reportar';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tickets', component: TicketsComponent },
  { path: 'reportar', component: ReportarComponent },
  { path: '**', redirectTo: 'dashboard' }
];
