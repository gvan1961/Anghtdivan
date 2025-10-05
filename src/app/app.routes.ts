import { Routes } from '@angular/router';
import { authGuard, permissionGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reservas',
    loadComponent: () => import('./features/reservas/reservas.component').then(m => m.ReservasComponent),
    canActivate: [authGuard, permissionGuard('RESERVA_READ')]
  },
  {
    path: 'apartamentos',
    loadComponent: () => import('./features/apartamentos/apartamentos.component').then(m => m.ApartamentosComponent),
    canActivate: [authGuard, permissionGuard('APARTAMENTO_READ')]
  },
  {
    path: 'clientes',
    loadComponent: () => import('./features/clientes/clientes.component').then(m => m.ClientesComponent),
    canActivate: [authGuard, permissionGuard('CLIENTE_READ')]
  },
  {
    path: 'produtos',
    loadComponent: () => import('./features/produtos/produtos.component').then(m => m.ProdutosComponent),
    canActivate: [authGuard, permissionGuard('PRODUTO_READ')]
  },
  {
    path: 'vendas',
    loadComponent: () => import('./features/vendas/vendas.component').then(m => m.VendasComponent),
    canActivate: [authGuard, permissionGuard('VENDA_CREATE')]
  },
  {
    path: 'pagamentos',
    loadComponent: () => import('./features/pagamentos/pagamentos.component').then(m => m.PagamentosComponent),
    canActivate: [authGuard, permissionGuard('PAGAMENTO_READ')]
  },
  {
    path: 'relatorios',
    loadComponent: () => import('./features/relatorios/relatorios.component').then(m => m.RelatoriosComponent),
    canActivate: [authGuard, permissionGuard('RELATORIO_READ')]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];