import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RelatorioService } from '../../core/services/relatorio.service';
import { Dashboard, RelatorioOcupacao, RelatorioFaturamento } from '../../core/models/relatorio.model';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarComponent,
    HeaderComponent,
    LoadingComponent
  ],
  template: `
    <div class="page-container">
      <app-sidebar></app-sidebar>
      
      <div class="main-content">
        <app-header></app-header>
        
        <div class="content">
          <h1>Relatórios e Análises</h1>

          <!-- Dashboard Principal -->
          <div class="dashboard-section" *ngIf="dashboard">
            <h2>📊 Dashboard - Hoje</h2>
            
            <div class="metrics-grid">
              <div class="metric-card ocupacao">
                <div class="metric-icon">🏨</div>
                <div class="metric-content">
                  <h3>Ocupação</h3>
                  <p class="metric-value">{{ dashboard.taxaOcupacao }}%</p>
                  <p class="metric-detail">
                    {{ dashboard.apartamentosOcupados }}/{{ dashboard.apartamentosOcupados + dashboard.apartamentosDisponiveis }} ocupados
                  </p>
                </div>
              </div>

              <div class="metric-card hospedes">
                <div class="metric-icon">👥</div>
                <div class="metric-content">
                  <h3>Hóspedes</h3>
                  <p class="metric-value">{{ dashboard.totalHospedes }}</p>
                  <p class="metric-detail">hóspedes ativos</p>
                </div>
              </div>

              <div class="metric-card financeiro">
                <div class="metric-icon">💰</div>
                <div class="metric-content">
                  <h3>Receita Hoje</h3>
                  <p class="metric-value">{{ formatarValor(dashboard.receitaDia) }}</p>
                  <p class="metric-detail">Mês: {{ formatarValor(dashboard.receitaMes) }}</p>
                </div>
              </div>

              <div class="metric-card movimentacao">
                <div class="metric-icon">📅</div>
                <div class="metric-content">
                  <h3>Movimentação</h3>
                  <p class="metric-value">{{ dashboard.checkInsHoje }}/{{ dashboard.checkOutsHoje }}</p>
                  <p class="metric-detail">Check-ins / Check-outs</p>
                </div>
              </div>
            </div>

            <div class="info-grid">
              <div class="info-card">
                <h4>💵 Financeiro</h4>
                <div class="info-row">
                  <span>Pagamentos Recebidos:</span>
                  <strong>{{ formatarValor(dashboard.pagamentosRecebidos) }}</strong>
                </div>
                <div class="info-row">
                  <span>Contas a Receber:</span>
                  <strong>{{ formatarValor(dashboard.contasReceber) }}</strong>
                </div>
                <div class="info-row">
                  <span>Reservas Ativas:</span>
                  <strong>{{ dashboard.reservasAtivas }}</strong>
                </div>
              </div>

              <div class="info-card">
                <h4>📦 Estoque</h4>
                <div class="info-row">
                  <span>Produtos Sem Estoque:</span>
                  <strong class="alert">{{ dashboard.produtosSemEstoque }}</strong>
                </div>
                <div class="info-row">
                  <span>Estoque Baixo:</span>
                  <strong class="warning">{{ dashboard.produtosEstoqueBaixo }}</strong>
                </div>
              </div>
            </div>
          </div>

          <app-loading *ngIf="loading && !dashboard"></app-loading>

          <!-- Relatório de Ocupação -->
          <div class="relatorio-section">
            <h2>📈 Relatório de Ocupação</h2>
            <form [formGroup]="ocupacaoForm" (ngSubmit)="gerarRelatorioOcupacao()">
              <div class="form-inline">
                <input 
                  type="date" 
                  formControlName="data" 
                  class="form-control" />
                <button type="submit" class="btn-primary" [disabled]="loading">
                  Gerar Relatório
                </button>
              </div>
            </form>

            <div class="relatorio-result" *ngIf="relatorioOcupacao">
              <div class="result-grid">
                <div class="result-item">
                  <span class="label">Total de Apartamentos</span>
                  <span class="value">{{ relatorioOcupacao.totalApartamentos }}</span>
                </div>
                <div class="result-item">
                  <span class="label">Ocupados</span>
                  <span class="value success">{{ relatorioOcupacao.apartamentosOcupados }}</span>
                </div>
                <div class="result-item">
                  <span class="label">Disponíveis</span>
                  <span class="value">{{ relatorioOcupacao.apartamentosDisponiveis }}</span>
                </div>
                <div class="result-item">
                  <span class="label">Taxa de Ocupação</span>
                  <span class="value highlight">{{ relatorioOcupacao.taxaOcupacao }}%</span>
                </div>
                <div class="result-item">
                  <span class="label">Total de Hóspedes</span>
                  <span class="value">{{ relatorioOcupacao.totalHospedes }}</span>
                </div>
                <div class="result-item">
                  <span class="label">Receita Diária</span>
                  <span class="value highlight">{{ formatarValor(relatorioOcupacao.receitaDiaria) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Relatório de Faturamento -->
          <div class="relatorio-section">
            <h2>💵 Relatório de Faturamento</h2>
            <form [formGroup]="faturamentoForm" (ngSubmit)="gerarRelatorioFaturamento()">
              <div class="form-inline">
                <input 
                  type="date" 
                  formControlName="dataInicio" 
                  class="form-control"
                  placeholder="Data Início" />
                <input 
                  type="date" 
                  formControlName="dataFim" 
                  class="form-control"
                  placeholder="Data Fim" />
                <button type="submit" class="btn-primary" [disabled]="loading">
                  Gerar Relatório
                </button>
              </div>
            </form>

            <div class="relatorio-result" *ngIf="relatorioFaturamento">
              <div class="faturamento-header">
                <h3>Período: {{ formatarData(relatorioFaturamento.dataInicio) }} a {{ formatarData(relatorioFaturamento.dataFim) }}</h3>
              </div>

              <div class="result-grid">
                <div class="result-item receita">
                  <span class="label">Receita Total</span>
                  <span class="value big">{{ formatarValor(relatorioFaturamento.receitaTotal) }}</span>
                </div>
                <div class="result-item">
                  <span class="label">Receita Diárias</span>
                  <span class="value">{{ formatarValor(relatorioFaturamento.receitaDiarias) }}</span>
                </div>
                <div class="result-item">
                  <span class="label">Receita Produtos</span>
                  <span class="value">{{ formatarValor(relatorioFaturamento.receitaProdutos) }}</span>
                </div>
              </div>

              <h4>Pagamentos por Forma</h4>
              <div class="result-grid">
                <div class="result-item">
                  <span class="label">💰 Dinheiro</span>
                  <span class="value">{{ formatarValor(relatorioFaturamento.pagamentoDinheiro) }}</span>
                </div>
                <div class="result-item">
                  <span class="label">📱 PIX</span>
                  <span class="value">{{ formatarValor(relatorioFaturamento.pagamentoPix) }}</span>
                </div>
                <div class="result-item">
                  <span class="label">💳 Débito</span>
                  <span class="value">{{ formatarValor(relatorioFaturamento.pagamentoCartaoDebito) }}</span>
                </div>
                <div class="result-item">
                  <span class="label">💳 Crédito</span>
                  <span class="value">{{ formatarValor(relatorioFaturamento.pagamentoCartaoCredito) }}</span>
                </div>
                <div class="result-item">
                  <span class="label">🏦 Transferência</span>
                  <span class="value">{{ formatarValor(relatorioFaturamento.pagamentoTransferencia) }}</span>
                </div>
                <div class="result-item">
                  <span class="label">📄 Faturado</span>
                  <span class="value">{{ formatarValor(relatorioFaturamento.pagamentoFaturado) }}</span>
                </div>
              </div>

              <h4>Estatísticas</h4>
              <div class="result-grid">
                <div class="result-item">
                  <span class="label">Reservas</span>
                  <span class="value">{{ relatorioFaturamento.quantidadeReservas }}</span>
                </div>
                <div class="result-item">
                  <span class="label">Check-ins</span>
                  <span class="value">{{ relatorioFaturamento.quantidadeCheckIns }}</span>
                </div>
                <div class="result-item">
                  <span class="label">Check-outs</span>
                  <span class="value">{{ relatorioFaturamento.quantidadeCheckOuts }}</span>
                </div>
                <div class="result-item">
                  <span class="label">Cancelamentos</span>
                  <span class="value alert">{{ relatorioFaturamento.quantidadeCancelamentos }}</span>
                </div>
                <div class="result-item">
                  <span class="label">Ticket Médio</span>
                  <span class="value highlight">{{ formatarValor(relatorioFaturamento.ticketMedio) }}</span>
                </div>
                <div class="result-item">
                  <span class="label">Média de Hóspedes</span>
                  <span class="value">{{ relatorioFaturamento.mediaHospedes }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .content {
      padding: 32px;
    }

    .content h1 {
      font-size: 28px;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 32px;
    }

    .dashboard-section, .relatorio-section {
      margin-bottom: 40px;
    }

    .dashboard-section h2, .relatorio-section h2 {
      font-size: 22px;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 20px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .metric-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .metric-icon {
      font-size: 40px;
    }

    .metric-content h3 {
      font-size: 14px;
      color: #718096;
      margin: 0 0 8px 0;
      font-weight: 600;
    }

    .metric-value {
      font-size: 28px;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 4px 0;
    }

    .metric-detail {
      font-size: 12px;
      color: #a0aec0;
      margin: 0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .info-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .info-card h4 {
      font-size: 16px;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 16px 0;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-row span {
      color: #4a5568;
      font-size: 14px;
    }

    .info-row strong {
      color: #2d3748;
      font-weight: 600;
    }

    .info-row .alert {
      color: #c53030;
    }

    .info-row .warning {
      color: #dd6b20;
    }

    .form-inline {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .form-control {
      padding: 10px 12px;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      font-size: 14px;
    }

    .btn-primary {
      padding: 10px 20px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .relatorio-result {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .faturamento-header {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #e2e8f0;
    }

    .faturamento-header h3 {
      font-size: 18px;
      color: #2d3748;
      margin: 0;
    }

    .relatorio-result h4 {
      font-size: 16px;
      font-weight: 700;
      color: #2d3748;
      margin: 24px 0 16px 0;
    }

    .result-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .result-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px;
      background: #f7fafc;
      border-radius: 8px;
    }

    .result-item.receita {
      background: #667eea;
      color: white;
      grid-column: span 2;
    }

    .result-item.receita .label,
    .result-item.receita .value {
      color: white;
    }

    .result-item .label {
      font-size: 13px;
      color: #718096;
      font-weight: 600;
    }

    .result-item .value {
      font-size: 20px;
      font-weight: 700;
      color: #2d3748;
    }

    .result-item .value.big {
      font-size: 28px;
    }

    .result-item .value.highlight {
      color: #667eea;
    }

    .result-item .value.success {
      color: #38a169;
    }

    .result-item .value.alert {
      color: #c53030;
    }
  `]
})
export class RelatoriosComponent implements OnInit {
  dashboard: Dashboard | null = null;
  relatorioOcupacao: RelatorioOcupacao | null = null;
  relatorioFaturamento: RelatorioFaturamento | null = null;
  ocupacaoForm!: FormGroup;
  faturamentoForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private relatorioService: RelatorioService
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.carregarDashboard();
  }

  initForms(): void {
    const hoje = new Date().toISOString().split('T')[0];
    
    this.ocupacaoForm = this.fb.group({
      data: [hoje, Validators.required]
    });

    this.faturamentoForm = this.fb.group({
      dataInicio: [hoje, Validators.required],
      dataFim: [hoje, Validators.required]
    });
  }

  carregarDashboard(): void {
    this.loading = true;
    this.relatorioService.gerarDashboard().subscribe({
      next: (dashboard) => {
        this.dashboard = dashboard;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dashboard:', error);
        this.loading = false;
      }
    });
  }

  gerarRelatorioOcupacao(): void {
    if (this.ocupacaoForm.invalid) return;

    this.loading = true;
    const data = this.ocupacaoForm.value.data;

    this.relatorioService.gerarRelatorioOcupacao(data).subscribe({
      next: (relatorio) => {
        this.relatorioOcupacao = relatorio;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao gerar relatório:', error);
        alert('Erro ao gerar relatório de ocupação');
        this.loading = false;
      }
    });
  }

  gerarRelatorioFaturamento(): void {
    if (this.faturamentoForm.invalid) return;

    const { dataInicio, dataFim } = this.faturamentoForm.value;

    if (new Date(dataFim) < new Date(dataInicio)) {
      alert('Data fim deve ser maior que data início');
      return;
    }

    this.loading = true;

    this.relatorioService.gerarRelatorioFaturamento(dataInicio, dataFim).subscribe({
      next: (relatorio) => {
        this.relatorioFaturamento = relatorio;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao gerar relatório:', error);
        alert('Erro ao gerar relatório de faturamento');
        this.loading = false;
      }
    });
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarData(data: Date | string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}