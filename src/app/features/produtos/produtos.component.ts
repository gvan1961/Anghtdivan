import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProdutoService } from '../../core/services/produto.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { Produto, Categoria } from '../../core/models/produto.model';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-produtos',
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
            <h1>Produtos</h1>
            <button class="btn-primary" (click)="abrirModal()">
              + Novo Produto
            </button>
          </div>

          <div class="filters">
            <button 
              class="filter-btn" 
              [class.active]="filtro === 'todos'"
              (click)="filtrar('todos')">
              Todos
            </button>
            <button 
              class="filter-btn filter-estoque-baixo" 
              [class.active]="filtro === 'estoque-baixo'"
              (click)="filtrar('estoque-baixo')">
              Estoque Baixo
            </button>
            <button 
              class="filter-btn filter-sem-estoque" 
              [class.active]="filtro === 'sem-estoque'"
              (click)="filtrar('sem-estoque')">
              Sem Estoque
            </button>
          </div>

          <div class="search-bar">
            <input 
              type="text" 
              placeholder="Buscar produto..."
              (input)="buscar($event)"
              class="search-input" />
          </div>

          <app-loading *ngIf="loading"></app-loading>

          <div class="table-container" *ngIf="!loading">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Estoque</th>
                  <th>Valor Venda</th>
                  <th>Valor Compra</th>
                  <th>Última Compra</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let produto of produtosFiltrados" 
                    [class.estoque-baixo]="produto.quantidade <= 10 && produto.quantidade > 0"
                    [class.sem-estoque]="produto.quantidade === 0">
                  <td>{{ produto.nomeProduto }}</td>
                  <td>{{ produto.categoria.nome }}</td>
                  <td>
                    <span class="estoque-badge" 
                          [class.baixo]="produto.quantidade <= 10 && produto.quantidade > 0"
                          [class.zero]="produto.quantidade === 0">
                      {{ produto.quantidade }}
                    </span>
                  </td>
                  <td>{{ formatarValor(produto.valorVenda) }}</td>
                  <td>{{ formatarValor(produto.valorCompra) }}</td>
                  <td>{{ formatarData(produto.dataUltimaCompra) }}</td>
                  <td class="actions-cell">
                    <button class="btn-action btn-edit" (click)="editar(produto)">
                      Editar
                    </button>
                    <button class="btn-action btn-estoque" (click)="atualizarEstoque(produto)">
                      Estoque
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="no-data" *ngIf="produtosFiltrados.length === 0">
              Nenhum produto encontrado
            </div>
          </div>
        </div>
      </div>

      <app-modal 
        [isOpen]="showModal" 
        [title]="produtoEditando ? 'Editar Produto' : 'Novo Produto'"
        (closed)="fecharModal()">
        <form [formGroup]="produtoForm" (ngSubmit)="salvar()">
          <div class="form-group">
            <label>Nome do Produto *</label>
            <input 
              type="text" 
              formControlName="nomeProduto" 
              class="form-control"
              placeholder="Digite o nome do produto" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Categoria *</label>
              <select formControlName="categoriaId" class="form-control">
                <option value="">Selecione</option>
                <option *ngFor="let cat of categorias" [value]="cat.id">
                  {{ cat.nome }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Quantidade em Estoque *</label>
              <input 
                type="number" 
                formControlName="quantidade" 
                min="0"
                class="form-control" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Valor de Venda *</label>
              <input 
                type="number" 
                formControlName="valorVenda" 
                step="0.01"
                min="0"
                class="form-control"
                placeholder="0.00" />
            </div>

            <div class="form-group">
              <label>Valor de Compra *</label>
              <input 
                type="number" 
                formControlName="valorCompra" 
                step="0.01"
                min="0"
                class="form-control"
                placeholder="0.00" />
            </div>
          </div>

          <div class="form-group">
            <label>Data da Última Compra</label>
            <input 
              type="date" 
              formControlName="dataUltimaCompra" 
              class="form-control" />
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="fecharModal()">
              Cancelar
            </button>
            <button type="submit" class="btn-primary" [disabled]="loading">
              Salvar
            </button>
          </div>
        </form>
      </app-modal>
    </div>
  `,
  styles: [`
    .filters {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }

    .filter-btn {
      padding: 8px 16px;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-btn.active {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .filter-estoque-baixo.active {
      background: #feebc8;
      border-color: #ed8936;
      color: #744210;
    }

    .filter-sem-estoque.active {
      background: #fed7d7;
      border-color: #fc8181;
      color: #742a2a;
    }

    .estoque-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: 600;
      background: #c6f6d5;
      color: #22543d;
    }

    .estoque-badge.baixo {
      background: #feebc8;
      color: #744210;
    }

    .estoque-badge.zero {
      background: #fed7d7;
      color: #742a2a;
    }

    .data-table tr.estoque-baixo {
      background: #fffaf0;
    }

    .data-table tr.sem-estoque {
      background: #fff5f5;
    }

    .btn-estoque {
      background: #d6bcfa;
      color: #44337a;
    }

    .search-bar {
      margin-bottom: 24px;
    }

    .search-input {
      width: 100%;
      max-width: 400px;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
    }
  `]
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  categorias: Categoria[] = [];
  loading = false;
  showModal = false;
  produtoForm!: FormGroup;
  produtoEditando: Produto | null = null;
  filtro: 'todos' | 'estoque-baixo' | 'sem-estoque' = 'todos';

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private categoriaService: CategoriaService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarCategorias();
  }

  initForm(): void {
    this.produtoForm = this.fb.group({
      nomeProduto: ['', Validators.required],
      categoriaId: ['', Validators.required],
      quantidade: [0, [Validators.required, Validators.min(0)]],
      valorVenda: [0, [Validators.required, Validators.min(0)]],
      valorCompra: [0, [Validators.required, Validators.min(0)]],
      dataUltimaCompra: ['']
    });
  }

  carregarProdutos(): void {
    this.loading = true;
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.aplicarFiltro();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.loading = false;
      }
    });
  }

  carregarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  filtrar(tipo: 'todos' | 'estoque-baixo' | 'sem-estoque'): void {
    this.filtro = tipo;
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    switch (this.filtro) {
      case 'estoque-baixo':
        this.produtosFiltrados = this.produtos.filter(p => p.quantidade > 0 && p.quantidade <= 10);
        break;
      case 'sem-estoque':
        this.produtosFiltrados = this.produtos.filter(p => p.quantidade === 0);
        break;
      default:
        this.produtosFiltrados = [...this.produtos];
    }
  }

  buscar(event: any): void {
    const termo = event.target.value.toLowerCase();
    if (!termo) {
      this.aplicarFiltro();
      return;
    }
    this.produtosFiltrados = this.produtos.filter(p =>
      p.nomeProduto.toLowerCase().includes(termo) ||
      p.categoria.nome.toLowerCase().includes(termo)
    );
  }

  abrirModal(): void {
    this.produtoEditando = null;
    this.produtoForm.reset({ quantidade: 0, valorVenda: 0, valorCompra: 0 });
    this.showModal = true;
  }

  editar(produto: Produto): void {
    this.produtoEditando = produto;
    const dataCompra = produto.dataUltimaCompra 
      ? new Date(produto.dataUltimaCompra).toISOString().split('T')[0]
      : '';
    
    this.produtoForm.patchValue({
      nomeProduto: produto.nomeProduto,
      categoriaId: produto.categoria.id,
      quantidade: produto.quantidade,
      valorVenda: produto.valorVenda,
      valorCompra: produto.valorCompra,
      dataUltimaCompra: dataCompra
    });
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
    this.produtoEditando = null;
  }

  salvar(): void {
    if (this.produtoForm.invalid) {
      Object.keys(this.produtoForm.controls).forEach(key => {
        this.produtoForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const formValue = this.produtoForm.value;
    
    const categoria = this.categorias.find(c => c.id === +formValue.categoriaId);
    if (!categoria) {
      alert('Categoria não encontrada');
      this.loading = false;
      return;
    }

    const produto: Produto = {
      ...formValue,
      categoria: categoria
    };

    const observable = this.produtoEditando
      ? this.produtoService.atualizar(this.produtoEditando.id!, produto)
      : this.produtoService.criar(produto);

    observable.subscribe({
      next: () => {
        alert('Produto salvo com sucesso!');
        this.fecharModal();
        this.carregarProdutos();
      },
      error: (error) => {
        console.error('Erro ao salvar produto:', error);
        alert('Erro ao salvar produto');
        this.loading = false;
      }
    });
  }

  atualizarEstoque(produto: Produto): void {
    const quantidade = prompt(
      `Estoque atual: ${produto.quantidade}\nNova quantidade:`,
      produto.quantidade.toString()
    );

    if (quantidade === null || isNaN(+quantidade)) return;

    this.produtoService.atualizarEstoque(produto.id!, +quantidade).subscribe({
      next: () => {
        alert('Estoque atualizado com sucesso!');
        this.carregarProdutos();
      },
      error: (error) => {
        console.error('Erro ao atualizar estoque:', error);
        alert('Erro ao atualizar estoque');
      }
    });
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarData(data: Date | string | undefined): string {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  }
}