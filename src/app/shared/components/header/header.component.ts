import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginResponse } from '../../../core/models/auth.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="header-title">
          <h1>{{ pageTitle }}</h1>
        </div>
        
        <div class="header-user">
          <span class="user-name">{{ currentUser?.nome }}</span>
          <button class="btn-logout" (click)="logout()">Sair</button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 70px;
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: fixed;
      top: 0;
      left: 250px;
      right: 0;
      z-index: 100;
    }

    .header-content {
      height: 100%;
      padding: 0 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-title h1 {
      font-size: 24px;
      font-weight: 600;
      color: #1a202c;
      margin: 0;
    }

    .header-user {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #2d3748;
    }

    .btn-logout {
      padding: 8px 16px;
      background: #f56565;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-logout:hover {
      background: #e53e3e;
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .header {
        left: 70px;
      }

      .header-content {
        padding: 0 16px;
      }

      .user-name {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  pageTitle = 'Dashboard';
  currentUser: LoginResponse | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout(): void {
    if (confirm('Deseja realmente sair do sistema?')) {
      this.authService.logout();
    }
  }
}