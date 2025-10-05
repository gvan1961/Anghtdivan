import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PagamentoService } from '../../core/services/pagamento.service';
import { ReservaService } from '../../core/services/reserva.service';
import { Pagamento, FormaPagamento } from '../../core/models/pagamento.model';
import { Reserva } from '../../core/models/reserva.model';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-pagamentos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarComponent,
    HeaderComponent,
    LoadingComponent,
    ModalComponent
  ],
  template: `
    <div class="page-container">
      <app-sidebar></app-sidebar>
      
      <div class="main-content">
        <app-header></app-header>
        
        <div class="content">
          <div class="page-header">
            <h1>Pagamentos</h1>
            <button class="btn-primary" (click)="abrirModal()">
              + Processar Pagamento
            </button>
          </div>

          <div class="resumo-card" *ngIf="resumoDia">
            <h3>Resumo do Dia</h3>
            <div class="resumo-grid">
              <div class="resumo-item">
                <span class="label">💰 Dinheiro</span>
                <span class="valor">{{ formatarValor(resumoDia.totalDinheiro) }}</span>
              </div>
              <div class="resumo-item">
                <span class="label">📱 PIX</span>
                <span class="valor">{{ formatarValor(resumoDia.totalPix) }}</span>
              </div>
              <div class="resumo-item">
                <span class="label">💳 Débito</span>
                <span class="valor">{{ formatarValor(resumoDia.totalCartaoDebito) }}</span>
              </div>
              <div class="resumo-item">
                <span class="label">💳 Crédito</span>
                <span class="valor">{{ formatarValor(resumoDia.totalCartaoCredito) }}</span>
              </div>
              <div class="resumo-item">
                <span class="label">🏦 Transferência</span>
                <span class="valor">{{ formatarValor(resumoDia.totalTransferencia) }}</span>
              </div>
              <div class="resumo-item">
                <span class="label">📄 Faturado</span>
                <span class="valor">{{ formatarValor(resumoDia.totalFaturado) }}</span>
              </div>
            </div>
            <div class="total-dia">
              <span class="label">TOTAL DO DIA</span>
              <span class="valor">{{ formatarValor(resumoDia.totalGeral) }}</span>
            </div>
          </div>

          <app-loading *ngIf="loading"></app-loading>

          <div class="table-container" *ngIf="!loading && pagamentos.length > 0">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Reserva</th>
                  <th>Cliente</th>
                  <th>Valor</th>
                  <th>Forma</th>
                  <th>Observação</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let pag of pagamentos">
                  <td>{{ formatarDataHora(pag.dataHoraPagamento) }}</td>
                  <td>{{ pag.reservaId}}</td>
                  <td>{{ pag.reserva?.cliente }}</td>
                  <td>{{ formatarValor(pag.valor) }}</td>
                  <td>
                    <span class="forma-badge" [ngClass]="'forma-' + pag.formaPagamento.toLowerCase()">
                      {{ getFormaPagamentoLabel(pag.formaPagamento) }}
                    </span>
                  </td>
                  <td>{{ pag.observacao || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <app-modal 
        [isOpen]="showModal" 
        [title]="'Processar Pagamento'"
        (closed)="fecharModal()">
        <form [formGroup]="pagamentoForm" (ngSubmit)="salvar()">
          <div class="form-group">
            <label>Reserva *</label>
            <select formControlName="reservaId" class="form-control" (change)="onReservaChange()">
              <option value="">Selecione a reserva</option>
              <option *ngFor="let reserva of reservasAtivas" [value]="reserva.id">
                Apto {{ reserva.apartamento.numeroApartamento }} - {{ reserva.cliente.nome }}
                (Saldo: {{ formatarValor(reserva.totalApagar) }})
              </option>
            </select>
          </div>

          <div class="saldo-info" *ngIf="reservaSelecionada">
            <p><strong>Saldo devedor:</strong> {{ formatarValor(reservaSelecionada.totalApagar) }}</p>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Valor *</label>
              <input 
                type="number" 
                formControlName="valor" 
                class="form-control"
                step="0.01"
                min="0.01"
                placeholder="0.00" />
            </div>

            <div class="form-group">
              <label>Forma de Pagamento *</label>
              <select formControlName="formaPagamento" class="form-control">
                <option value="">Selecione</option>
                <option value="DINHEIRO">Dinheiro</option>
                <option value="PIX">PIX</option>
                <option value="CARTAO_DEBITO">Cartão Débito</option>
                <option value="CARTAO_CREDITO">Cartão Crédito</option>
                <option value="TRANSFERENCIA_BANCARIA">Transferência</option>
                <option value="FATURADO">Faturado</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Observação</label>
            <textarea 
              formControlName="observacao" 
              class="form-control"
              rows="3"
              placeholder="Observações sobre o pagamento..."></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="fecharModal()">
              Cancelar
            </button>
            <button type="submit" class="btn-primary" [disabled]="loading">
              Processar Pagamento
            </button>
          </div>
        </form>
      </app-modal>
    </div>
  `,
  styles: [`
    .resumo-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 24px;
    }

    .resumo-card h3 {
      margin: 0 0 20px 0;
      font-size: 20px;
      color: #2d3748;
    }

    .resumo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .resumo-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .resumo-item .label {
      font-size: 13px;
      color: #718096;
      font-weight: 600;
    }

    .resumo-item .valor {
      font-size: 20px;
      color: #2d3748;
      font-weight: 700;
    }

    .total-dia {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #667eea;
      border-radius: 8px;
      color: white;
    }

    .total-dia .label {
      font-weight: 600;
    }

    .total-dia .valor {
      font-size: 24px;
      font-weight: 700;
    }

    .forma-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .forma-dinheiro { background: #c6f6d5; color: #22543d; }
    .forma-pix { background: #bee3f8; color: #2c5282; }
    .forma-cartao_debito { background: #d6bcfa; color: #44337a; }
    .forma-cartao_credito { background: #fed7d7; color: #742a2a; }
    .forma-transferencia_bancaria { background: #feebc8; color: #744210; }
    .forma-faturado { background: #e2e8f0; color: #2d3748; }

    .saldo-info {
      background: #edf2f7;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 16px;
    }

    .saldo-info p {
      margin: 0;
      color: #2d3748;
    }
  `]
})
export class PagamentosComponent implements OnInit {
  pagamentoForm!: FormGroup;
  pagamentos: Pagamento[] = [];
  reservasAtivas: Reserva[] = [];
  reservaSelecionada: Reserva | null = null;
  resumoDia: any = null;
  loading = false;
  showModal = false;

  constructor(
    private fb: FormBuilder,
    private pagamentoService: PagamentoService,
    private reservaService: ReservaService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.carregarPagamentosDoDia();
    this.carregarReservasAtivas();
    this.carregarResumoDoDia();
  }

  initForm(): void {
    this.pagamentoForm = this.fb.group({
      reservaId: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      formaPagamento: ['', Validators.required],
      observacao: ['']
    });
  }

  carregarPagamentosDoDia(): void {
    this.loading = true;
    const hoje = new Date().toISOString();
    
    this.pagamentoService.buscarPagamentosDoDia(hoje).subscribe({
      next: (pagamentos) => {
        this.pagamentos = pagamentos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar pagamentos:', error);
        this.loading = false;
      }
    });
  }

  carregarReservasAtivas(): void {
    this.reservaService.buscarAtivas().subscribe({
      next: (reservas) => {
        this.reservasAtivas = reservas.filter(r => r.totalApagar > 0);
      },
      error: (error) => {
        console.error('Erro ao carregar reservas:', error);
      }
    });
  }

  carregarResumoDoDia(): void {
    const hoje = new Date().toISOString();
    
    this.pagamentoService.gerarResumoDoDia(hoje).subscribe({
      next: (resumo) => {
        this.resumoDia = resumo;
      },
      error: (error) => {
        console.error('Erro ao carregar resumo:', error);
      }
    });
  }

  onReservaChange(): void {
    const reservaId = this.pagamentoForm.get('reservaId')?.value;
    this.reservaSelecionada = this.reservasAtivas.find(r => r.id === +reservaId) || null;
  }

  abrirModal(): void {
    this.pagamentoForm.reset();
    this.reservaSelecionada = null;
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
  }

  salvar(): void {
    if (this.pagamentoForm.invalid) {
      Object.keys(this.pagamentoForm.controls).forEach(key => {
        this.pagamentoForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const pagamento = this.pagamentoForm.value;

    this.pagamentoService.processar(pagamento).subscribe({
      next: () => {
        alert('Pagamento processado com sucesso!');
        this.fecharModal();
        this.carregarPagamentosDoDia();
        this.carregarReservasAtivas();
        this.carregarResumoDoDia();
      },
      error: (error) => {
        console.error('Erro ao processar pagamento:', error);
        alert(error.error || 'Erro ao processar pagamento');
        this.loading = false;
      }
    });
  }

  getFormaPagamentoLabel(forma: FormaPagamento | string): string {
  const labels: Record<string, string> = {
    'DINHEIRO': 'Dinheiro',
    'PIX': 'PIX',
    'CARTAO_DEBITO': 'Débito',
    'CARTAO_CREDITO': 'Crédito',
    'TRANSFERENCIA_BANCARIA': 'Transferência',
    'FATURADO': 'Faturado'
  };
  return labels[forma.toString()] || forma.toString();
}

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarDataHora(data: Date | string | undefined): string {
    if (!data) return '-';
    return new Date(data).toLocaleString('pt-BR');
  }
}