import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { VendaService } from '../../core/services/venda.service';
import { ProdutoService } from '../../core/services/produto.service';
import { ReservaService } from '../../core/services/reserva.service';
import { Produto } from '../../core/models/produto.model';
import { Reserva } from '../../core/models/reserva.model';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-vendas',
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
            <h1>Vendas para Reservas</h1>
            <button class="btn-primary" (click)="abrirModal()">
              + Nova Venda
            </button>
          </div>

          <div class="info-card">
            <h3>📝 Como funciona</h3>
            <p>Adicione produtos consumidos pelos hóspedes diretamente na reserva.</p>
            <p>Os valores serão adicionados à conta da reserva automaticamente.</p>
          </div>

          <app-loading *ngIf="loading"></app-loading>
        </div>
      </div>

      <app-modal 
        [isOpen]="showModal" 
        [title]="'Adicionar Venda à Reserva'"
        (closed)="fecharModal()">
        <form [formGroup]="vendaForm" (ngSubmit)="salvar()">
          <div class="form-group">
            <label>Reserva *</label>
            <select formControlName="reservaId" class="form-control">
              <option value="">Selecione a reserva</option>
              <option *ngFor="let reserva of reservasAtivas" [value]="reserva.id">
                Apto {{ reserva.apartamento.numeroApartamento }} - {{ reserva.cliente.nome }}
              </option>
            </select>
          </div>

          <div class="itens-section">
            <div class="itens-header">
              <h4>Produtos</h4>
              <button type="button" class="btn-add-item" (click)="adicionarItem()">
                + Adicionar Produto
              </button>
            </div>

            <div formArrayName="itens" class="itens-list">
              <div *ngFor="let item of itens.controls; let i = index" 
                   [formGroupName]="i" 
                   class="item-row">
                <div class="item-fields">
                  <div class="form-group">
                    <select formControlName="produtoId" class="form-control">
                      <option value="">Selecione o produto</option>
                      <option *ngFor="let produto of produtos" [value]="produto.id">
                        {{ produto.nomeProduto }} - {{ formatarValor(produto.valorVenda) }}
                        (Estoque: {{ produto.quantidade }})
                      </option>
                    </select>
                  </div>

                  <div class="form-group">
                    <input 
                      type="number" 
                      formControlName="quantidade" 
                      class="form-control"
                      placeholder="Qtd"
                      min="1" />
                  </div>

                  <button 
                    type="button" 
                    class="btn-remove-item" 
                    (click)="removerItem(i)">
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="total-section" *ngIf="calcularTotal() > 0">
            <h3>Total: {{ formatarValor(calcularTotal()) }}</h3>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="fecharModal()">
              Cancelar
            </button>
            <button type="submit" class="btn-primary" [disabled]="loading">
              Salvar Venda
            </button>
          </div>
        </form>
      </app-modal>
    </div>
  `,
  styles: [`
    .info-card {
      background: #edf2f7;
      border-left: 4px solid #667eea;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .info-card h3 {
      font-size: 18px;
      margin: 0 0 12px 0;
      color: #2d3748;
    }

    .info-card p {
      margin: 8px 0;
      color: #4a5568;
    }

    .itens-section {
      margin: 24px 0;
      padding: 20px;
      background: #f7fafc;
      border-radius: 8px;
    }

    .itens-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .itens-header h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #2d3748;
    }

    .btn-add-item {
      padding: 6px 12px;
      background: #48bb78;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .itens-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .item-row {
      background: white;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }

    .item-fields {
      display: grid;
      grid-template-columns: 1fr 120px 40px;
      gap: 12px;
      align-items: start;
    }

    .btn-remove-item {
      width: 32px;
      height: 32px;
      background: #fed7d7;
      color: #742a2a;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 8px;
    }

    .total-section {
      background: #667eea;
      color: white;
      padding: 16px;
      border-radius: 8px;
      text-align: right;
      margin-top: 16px;
    }

    .total-section h3 {
      margin: 0;
      font-size: 20px;
    }
  `]
})
export class VendasComponent implements OnInit {
  vendaForm!: FormGroup;
  reservasAtivas: Reserva[] = [];
  produtos: Produto[] = [];
  loading = false;
  showModal = false;

  constructor(
    private fb: FormBuilder,
    private vendaService: VendaService,
    private produtoService: ProdutoService,
    private reservaService: ReservaService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.carregarReservasAtivas();
    this.carregarProdutos();
  }

  initForm(): void {
    this.vendaForm = this.fb.group({
      reservaId: ['', Validators.required],
      itens: this.fb.array([])
    });
  }

  get itens(): FormArray {
    return this.vendaForm.get('itens') as FormArray;
  }

  adicionarItem(): void {
    const itemGroup = this.fb.group({
      produtoId: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]]
    });
    this.itens.push(itemGroup);
  }

  removerItem(index: number): void {
    this.itens.removeAt(index);
  }

  carregarReservasAtivas(): void {
    this.reservaService.buscarAtivas().subscribe({
      next: (reservas) => {
        this.reservasAtivas = reservas;
      },
      error: (error) => {
        console.error('Erro ao carregar reservas:', error);
      }
    });
  }

  carregarProdutos(): void {
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos.filter(p => p.quantidade > 0);
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
      }
    });
  }

  abrirModal(): void {
    this.vendaForm.reset();
    this.itens.clear();
    this.adicionarItem();
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
  }

  calcularTotal(): number {
    let total = 0;
    this.itens.controls.forEach(item => {
      const produtoId = item.get('produtoId')?.value;
      const quantidade = item.get('quantidade')?.value || 0;
      const produto = this.produtos.find(p => p.id === +produtoId);
      if (produto) {
        total += produto.valorVenda * quantidade;
      }
    });
    return total;
  }

  salvar(): void {
    if (this.vendaForm.invalid || this.itens.length === 0) {
      alert('Preencha todos os campos e adicione pelo menos um produto');
      return;
    }

    this.loading = true;
    const venda = this.vendaForm.value;

    this.vendaService.adicionarVendaParaReserva(venda).subscribe({
      next: () => {
        alert('Venda adicionada com sucesso!');
        this.fecharModal();
      },
      error: (error) => {
        console.error('Erro ao salvar venda:', error);
        alert(error.error || 'Erro ao salvar venda');
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
}