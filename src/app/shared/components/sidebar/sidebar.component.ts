import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>Hotel Di Van</h2>
      </div>
      
      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <span class="icon">📊</span>
          <span>Dashboard</span>
        </a>

        <a routerLink="/reservas" routerLinkActive="active" class="nav-item" 
           *ngIf="hasPermission('RESERVA_READ')">
          <span class="icon">📅</span>
          <span>Reservas</span>
        </a>

        <a routerLink="/apartamentos" routerLinkActive="active" class="nav-item"
           *ngIf="hasPermission('APARTAMENTO_READ')">
          <span class="icon">🏨</span>
          <span>Apartamentos</span>
        </a>

        <a routerLink="/clientes" routerLinkActive="active" class="nav-item"
           *ngIf="hasPermission('CLIENTE_READ')">
          <span class="icon">👥</span>
          <span>Clientes</span>
        </a>

        <a routerLink="/produtos" routerLinkActive="active" class="nav-item"
           *ngIf="hasPermission('PRODUTO_READ')">
          <span class="icon">📦</span>
          <span>Produtos</span>
        </a>

        <a routerLink="/vendas" routerLinkActive="active" class="nav-item"
           *ngIf="hasPermission('VENDA_CREATE')">
          <span class="icon">🛒</span>
          <span>Vendas</span>
        </a>

        <a routerLink="/pagamentos" routerLinkActive="active" class="nav-item"
           *ngIf="hasPermission('PAGAMENTO_READ')">
          <span class="icon">💰</span>
          <span>Pagamentos</span>
        </a>

        <a routerLink="/relatorios" routerLinkActive="active" class="nav-item"
           *ngIf="hasPermission('RELATORIO_READ')">
          <span class="icon">📈</span>
          <span>Relatórios</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background: white;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
      overflow-y: auto;
      z-index: 1000;
    }

    .sidebar-header {
      padding: 24px 20px;
      border-bottom: 1px solid #e2e8f0;
    }

    .sidebar-header h2 {
      font-size: 20px;
      font-weight: 700;
      color: #667eea;
      margin: 0;
    }

    .sidebar-nav {
      padding: 20px 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      color: #4a5568;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
    }

    .nav-item:hover {
      background: #f7fafc;
      color: #667eea;
    }

    .nav-item.active {
      background: #edf2f7;
      color: #667eea;
      border-right: 3px solid #667eea;
      font-weight: 600;
    }

    .icon {
      font-size: 20px;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 70px;
      }

      .sidebar-header h2 {
        font-size: 16px;
      }

      .nav-item span:last-child {
        display: none;
      }
    }
  `]
})
export class SidebarComponent {
  constructor(private authService: AuthService) {}

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
}