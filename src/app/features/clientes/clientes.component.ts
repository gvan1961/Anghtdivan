import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../core/services/cliente.service';
import { EmpresaService } from '../../core/services/empresa.service'; // CORREÇÃO: Adicionar
import { Cliente, Empresa } from '../../core/models/cliente.model'; // CORREÇÃO: Importar Empresa
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarComponent,
    HeaderComponent,
    LoadingComponent,
    ModalComponent
  ],
  templateUrl: './clientes.component.html'  
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  loading = false;
  showModal = false;
  clienteForm!: FormGroup;
  clienteEditando: Cliente | null = null;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.carregarClientes();
  }

  initForm(): void {
    this.clienteForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      celular: ['', Validators.required],
      endereco: [''],
      cep: [''],
      cidade: [''],
      estado: [''],
      dataNascimento: ['', Validators.required],
      empresaId: [null]
    });
  }

  carregarClientes(): void {
    this.loading = true;
    this.clienteService.listar().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.clientesFiltrados = clientes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        alert('Erro ao carregar clientes');
        this.loading = false;
      }
    });
  }

  buscar(event: any): void {
    const termo = event.target.value.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(c =>
      c.nome.toLowerCase().includes(termo) ||
      c.cpf.includes(termo)
    );
  }

  abrirModal(): void {
    this.clienteEditando = null;
    this.clienteForm.reset();
    this.showModal = true;
  }

  editar(cliente: Cliente): void {
    this.clienteEditando = cliente;
    const dataNascimento = new Date(cliente.dataNascimento).toISOString().split('T')[0];
    
    this.clienteForm.patchValue({
      nome: cliente.nome,
      cpf: cliente.cpf,
      celular: cliente.celular,
      endereco: cliente.endereco || '',
      cep: cliente.cep || '',
      cidade: cliente.cidade || '',
      estado: cliente.estado || '',
      dataNascimento: dataNascimento,
      empresaId: cliente.empresaId || null
    });
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
    this.clienteEditando = null;
  }

  salvar(): void {
    if (this.clienteForm.invalid) {
      Object.keys(this.clienteForm.controls).forEach(key => {
        this.clienteForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const cliente = this.clienteForm.value;

    const observable = this.clienteEditando
      ? this.clienteService.atualizar(this.clienteEditando.id!, cliente)
      : this.clienteService.criar(cliente);

    observable.subscribe({
      next: () => {
        alert('Cliente salvo com sucesso!');
        this.fecharModal();
        this.carregarClientes();
      },
      error: (error) => {
        console.error('Erro ao salvar cliente:', error);
        alert(error.error || 'Erro ao salvar cliente');
        this.loading = false;
      }
    });
  }

  deletar(id: number): void {
    if (!confirm('Deseja realmente excluir este cliente?')) return;

    this.loading = true;
    this.clienteService.deletar(id).subscribe({
      next: () => {
        alert('Cliente excluído com sucesso!');
        this.carregarClientes();
      },
      error: (error) => {
        console.error('Erro ao excluir cliente:', error);
        alert('Erro ao excluir cliente');
        this.loading = false;
      }
    });
  }

  formatarCPF(cpf: string): string {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatarData(data: Date | string): string {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
  }

  aplicarMascaraCPF(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.substr(0, 11);
    
    if (valor.length > 9) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (valor.length > 6) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    } else if (valor.length > 3) {
      valor = valor.replace(/(\d{3})(\d{3})/, '$1.$2');
    }
    
    this.clienteForm.patchValue({ cpf: valor });
  }

  aplicarMascaraCelular(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.substr(0, 11);
    
    if (valor.length > 10) {
      valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (valor.length > 6) {
      valor = valor.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
    }
    
    this.clienteForm.patchValue({ celular: valor });
  }

  aplicarMascaraCEP(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.substr(0, 8);
    
    if (valor.length > 5) {
      valor = valor.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    
    this.clienteForm.patchValue({ cep: valor });
  }
}

