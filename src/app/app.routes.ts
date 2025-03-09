import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      // Ruta de login
      {
        path: 'login',
        title: 'Inicio de Sesión',
        loadComponent: () =>
          import('./components/login/login.component').then(
            (m) => m.LogicComponent
          )
      },
      {
        path: 'dashboard-nph',
        title: 'Dashboard',
        loadComponent: () => import('./dashboard/pages/dashboard/dashboard.component'),
      },
      {
        path: 'beneficiarios',
        title: 'Beneficarios',
        loadComponent: () => import('./dashboard/pages/beneficiarios/beneficiarios.component').then(m => m.BeneficiariosComponent),
      },
      {
        path: 'asistencias',
        title: 'Asistencias',
        loadComponent: () => import('./dashboard/pages/asistencias/asistencias.component').then(m => m.AsistenciasComponent),
      },
      {
        path: 'reportes',
        title: 'Reportes',
        loadComponent: () => import('./dashboard/pages/reportes/reportes.component').then(m => m.ReportesComponent),
      },
      {
        path: 'personas',
        title: 'Personas',
        loadComponent: () => import('./dashboard/pages/personas/personas.component').then(m => m.PersonasComponent),
      },
      {
        path: 'familia',
        title: 'Familia',
        loadComponent: () => import('./dashboard/pages/familia/familia.component').then(m => m.FamiliaComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard-nph',
        pathMatch: 'full',
      }
    ]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];
