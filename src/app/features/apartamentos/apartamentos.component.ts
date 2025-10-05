import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApartamentoService } from '../../core/services/apartamento.service';
import { Apartamento, StatusApartamento } from '../../core/models/apartamento.model';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-apartamentos',
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
            <h1>Apartamentos</h1>
            <button class="btn-primary" (click)="abrirModal()">
              + Novo Apartamento
            </button>
          </div>

          <div class="filters">
            <button 
              class="filter-btn" 
              [class.active]="filtroStatus === null"
              (click)="filtrar(null)">
              Todos
            </button>
            <button 
              class="filter-btn status-disponivel" 
              [class.active]="filtroStatus === StatusApartamento.DISPONIVEL"
              (click)="filtrar(StatusApartamento.DISPONIVEL)">
              Disponíveis
            </button>
            <button 
              class="filter-btn status-ocupado" 
              [class.active]="filtroStatus === StatusApartamento.OCUPADO"
              (click)="filtrar(StatusApartamento.OCUPADO)">
              Ocupados
            </button>
            <button 
              class="filter-btn status-limpeza" 
              [class.active]="filtroStatus === StatusApartamento.LIMPEZA"
              (click)="filtrar(StatusApartamento.LIMPEZA)">
              Limpeza
            </button>
            <button 
              class="filter-btn status-manutencao" 
              [class.active]="filtroStatus === StatusApartamento.MANUTENCAO"
              (click)="filtrar(StatusApartamento.MANUTENCAO)">
              Manutenção
            </button>
          </div>

          <app-loading *ngIf="loading"></app-loading>

          <div class="apartamentos-grid" *ngIf="!loading">
            <div *ngFor="let apt of apartamentos" class="apartamento-card">
              <div class="card-header">
                <h3>{{ apt.numeroApartamento }}</h3>
                <span class="status-badge" [ngClass]="'status-' + apt.status.toLowerCase()">
                  {{ getStatusLabel(apt.status) }}
                </span>
              </div>
              
              <div class="card-body">
                <p><strong>Tipo:</strong> {{ apt.tipoApartamento.tipo }}</p>
                <p><strong>Capacidade:</strong> {{ apt.capacidade }} pessoas</p>
                <p><strong>Camas:</strong> {{ apt.camasDoApartamento }}</p>
                <p *ngIf="apt.tv"><strong>TV:</strong> {{ apt.tv }}</p>
              </div>

              <div class="card-actions">
                <button class="btn-action btn-edit" (click)="editar(apt)">
                  Editar
                </button>
                <button class="btn-action btn-status" (click)="alterarStatus(apt)">
                  Alterar Status
                </button>
              </div>
            </div>
          </div>

          <div class="no-data" *ngIf="!loading && apartamentos.length === 0">
            Nenhum apartamento encontrado
          </div>
        </div>
      </div>

      <app-modal 
        [isOpen]="showModal" 
        [title]="apartamentoEditando ? 'Editar Apartamento' : 'Novo Apartamento'"
        (closed)="fecharModal()">
        <form [formGroup]="apartamentoForm" (ngSubmit)="salvar()">
          <div class="form-group">
            <label>Número do Apartamento *</label>
            <input type="text" formControlName="numeroApartamento" class="form-control" placeholder="Ex: 101" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Tipo *</label>
              <select formControlName="tipoId" class="form-control">
                <option value="">Selecione</option>
                <option value="1">Tipo A</option>
                <option value="2">Tipo B</option>
                <option value="3">Tipo C</option>
              </select>
            </div>

            <div class="form-group">
              <label>Capacidade *</label>
              <input type="number" formControlName="capacidade" min="1" class="form-control" />
            </div>
          </div>

          <div class="form-group">
            <label>Camas *</label>
            <input type="text" formControlName="camasDoApartamento" class="form-control" placeholder="Ex: 1 Casal, 2 Solteiro" />
          </div>

          <div class="form-group">
            <label>TV</label>
            <input type="text" formControlName="tv" class="form-control" placeholder="Ex: Smart TV 42'" />
          </div>

          <div class="form-group">
            <label>Status *</label>
            <select formControlName="status" class="form-control">
              <option value="DISPONIVEL">Disponível</option>
              <option value="OCUPADO">Ocupado</option>
              <option value="LIMPEZA">Limpeza</option>
              <option value="MANUTENCAO">Manutenção</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="fecharModal()">Cancelar</button>
            <button type="submit" class="btn-primary" [disabled]="loading">Salvar</button>
          </div>
        </form>
      </app-modal>
    </div>
  `,
  styles: [`
    .page-container { display: flex; min-height: 100vh; background: #f7fafc; }
    .main-content { flex: 1; margin-left: 250px; padding-top: 70px; }
    .content { padding: 32px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .filters { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
    .filter-btn { padding: 8px 16px; background: white; border: 2px solid #e2e8f0; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .filter-btn.active { transform: scale(1.05); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .apartamentos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .apartamento-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s; }
    .apartamento-card:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.15); }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .card-header h3 { font-size: 24px; font-weight: 700; color: #667eea; margin: 0; }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-disponivel { background: #c6f6d5; color: #22543d; }
    .status-ocupado { background: #fed7d7; color: #742a2a; }
    .status-limpeza { background: #feebc8; color: #744210; }
    .status-manutencao { background: #e2e8f0; color: #2d3748; }
    .card-body p { margin: 8px 0; color: #4a5568; }
    .card-actions { display: flex; gap: 8px; margin-top: 16px; }
    .btn-action { flex: 1; padding: 8px; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-edit { background: #bee3f8; color: #2c5282; }
    .btn-status { background: #e2e8f0; color: #2d3748; }
    .btn-primary { padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #2d3748; }
    .form-control { width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 6px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
    .no-data { padding: 40px; text-align: center; color: #718096; }
  `]
})
export class ApartamentosComponent implements OnInit {
  apartamentos: Apartamento[] = [];
  loading = false;
  showModal = false;
  apartamentoForm!: FormGroup;
  apartamentoEditando: Apartamento | null = null;
  filtroStatus: StatusApartamento | null = null;
  StatusApartamento = StatusApartamento;

  constructor(
    private fb: FormBuilder,
    private apartamentoService: ApartamentoService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.carregarApartamentos();
  }

  initForm(): void {
    this.apartamentoForm = this.fb.group({
      numeroApartamento: ['', Validators.required],
      tipoId: ['', Validators.required],
      capacidade: [1, [Validators.required, Validators.min(1)]],
      camasDoApartamento: ['', Validators.required],
      status: ['DISPONIVEL', Validators.required],
      tv: ['']
    });
  }

  carregarApartamentos(): void {
    this.loading = true;
    const observable = this.filtroStatus 
      ? this.apartamentoService.buscarPorStatus(this.filtroStatus)
      : this.apartamentoService.listar();
    
    observable.subscribe({
      next: (apartamentos) => {
        this.apartamentos = apartamentos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar apartamentos:', error);
        this.loading = false;
      }
    });
  }

  abrirModal(): void {
    this.apartamentoEditando = null;
    this.apartamentoForm.reset({ capacidade: 1, status: 'DISPONIVEL' });
    this.showModal = true;
  }

  editar(apartamento: Apartamento): void {
    this.apartamentoEditando = apartamento;
    this.apartamentoForm.patchValue({
      numeroApartamento: apartamento.numeroApartamento,
      tipoId: apartamento.tipoApartamento.id,
      capacidade: apartamento.capacidade,
      camasDoApartamento: apartamento.camasDoApartamento,
      status: apartamento.status,
      tv: apartamento.tv
    });
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
    this.apartamentoEditando = null;
  }

  salvar(): void {
    if (this.apartamentoForm.invalid) {
      Object.keys(this.apartamentoForm.controls).forEach(key => {
        this.apartamentoForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const formValue = this.apartamentoForm.value;
    const tipoId = +formValue.tipoId;
    
    const apartamento: any = {
      numeroApartamento: formValue.numeroApartamento,
      tipoApartamento: {
        id: tipoId,
        tipo: tipoId === 1 ? 'A' : tipoId === 2 ? 'B' : 'C',
        descricao: `Tipo ${tipoId === 1 ? 'A' : tipoId === 2 ? 'B' : 'C'}`
      },
      capacidade: formValue.capacidade,
      camasDoApartamento: formValue.camasDoApartamento,
      status: formValue.status,
      tv: formValue.tv
    };

    const observable = this.apartamentoEditando
      ? this.apartamentoService.atualizar(this.apartamentoEditando.id!, apartamento)
      : this.apartamentoService.criar(apartamento);

    observable.subscribe({
      next: () => {
        alert('Apartamento salvo com sucesso!');
        this.fecharModal();
        this.carregarApartamentos();
      },
      error: (error) => {
        console.error('Erro ao salvar apartamento:', error);
        alert('Erro ao salvar apartamento');
        this.loading = false;
      }
    });
  }

  alterarStatus(apartamento: Apartamento): void {
    const statuses = [
      { value: StatusApartamento.DISPONIVEL, label: 'Disponível' },
      { value: StatusApartamento.OCUPADO, label: 'Ocupado' },
      { value: StatusApartamento.LIMPEZA, label: 'Limpeza' },
      { value: StatusApartamento.MANUTENCAO, label: 'Manutenção' }
    ];

    const opcoes = statuses.map((s, i) => `${i + 1}. ${s.label}`).join('\n');
    const escolha = prompt(`Status atual: ${this.getStatusLabel(apartamento.status)}\n\nEscolha:\n${opcoes}`);

    if (!escolha) return;
    const index = parseInt(escolha) - 1;
    if (index >= 0 && index < statuses.length) {
      this.apartamentoService.atualizarStatus(apartamento.id!, statuses[index].value).subscribe({
        next: () => {
          alert('Status atualizado com sucesso!');
          this.carregarApartamentos();
        },
        error: (error) => {
          console.error('Erro ao atualizar status:', error);
          alert('Erro ao atualizar status');
        }
      });
    }
  }

  filtrar(status: StatusApartamento | null): void {
    this.filtroStatus = status;
    this.carregarApartamentos();
  }

  getStatusLabel(status: StatusApartamento): string {
    const labels: Record<StatusApartamento, string> = {
      [StatusApartamento.DISPONIVEL]: 'Disponível',
      [StatusApartamento.OCUPADO]: 'Ocupado',
      [StatusApartamento.LIMPEZA]: 'Limpeza',
      [StatusApartamento.PRE_RESERVA]: 'Pré-Reserva',
      [StatusApartamento.MANUTENCAO]: 'Manutenção'
    };
    return labels[status] || status;
  }
}