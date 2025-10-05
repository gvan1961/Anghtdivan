import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReservaService } from '../../core/services/reserva.service';
import { ClienteService } from '../../core/services/cliente.service';
import { ApartamentoService } from '../../core/services/apartamento.service';
import { Reserva, StatusReserva } from '../../core/models/reserva.model';
import { Cliente } from '../../core/models/cliente.model';
import { Apartamento } from '../../core/models/apartamento.model';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';


@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarComponent,
    HeaderComponent,
    LoadingComponent,
    ModalComponent
  ],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  reservas: Reserva[] = [];
  clientes: Cliente[] = [];
  apartamentosDisponiveis: Apartamento[] = [];
  loading = false;
  showModal = false;
  reservaForm!: FormGroup;
  filtroStatus: StatusReserva | 'TODAS' = 'TODAS';
  
  // ADICIONAR ENUM PARA USO NO TEMPLATE
  StatusReserva = StatusReserva;
  
  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService,
    private clienteService: ClienteService,
    private apartamentoService: ApartamentoService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.carregarReservas();
    this.carregarClientes();
  }

  initForm(): void {
    this.reservaForm = this.fb.group({
      apartamentoId: ['', Validators.required],
      clienteId: ['', Validators.required],
      quantidadeHospede: [1, [Validators.required, Validators.min(1)]],
      dataCheckin: ['', Validators.required],
      dataCheckout: ['', Validators.required]
    });
  }

  carregarReservas(): void {
    this.loading = true;
    
    const observable = this.filtroStatus === 'TODAS' 
      ? this.reservaService.listar()
      : this.filtroStatus === 'ATIVA'
        ? this.reservaService.buscarAtivas()
        : this.reservaService.listar();
    
    observable.subscribe({
      next: (reservas) => {
        this.reservas = this.filtroStatus === 'TODAS' 
          ? reservas 
          : reservas.filter(r => r.status === this.filtroStatus);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar reservas:', error);
        this.loading = false;
        alert('Erro ao carregar reservas');
      }
    });
  }

  carregarClientes(): void {
    this.clienteService.listar().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
      }
    });
  }

  onDateChange(): void {
    const checkin = this.reservaForm.get('dataCheckin')?.value;
    const checkout = this.reservaForm.get('dataCheckout')?.value;
    
    if (checkin && checkout) {
      this.apartamentoService.buscarDisponiveisParaPeriodo(checkin, checkout).subscribe({
        next: (apartamentos) => {
          this.apartamentosDisponiveis = apartamentos;
        },
        error: (error) => {
          console.error('Erro ao buscar apartamentos:', error);
        }
      });
    }
  }

  abrirModal(): void {
    this.showModal = true;
    this.reservaForm.reset({ quantidadeHospede: 1 });
  }

  fecharModal(): void {
    this.showModal = false;
  }

  salvar(): void {
    if (this.reservaForm.invalid) {
      Object.keys(this.reservaForm.controls).forEach(key => {
        this.reservaForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    
    this.reservaService.criar(this.reservaForm.value).subscribe({
      next: () => {
        alert('Reserva criada com sucesso!');
        this.fecharModal();
        this.carregarReservas();
      },
      error: (error) => {
        console.error('Erro ao criar reserva:', error);
        alert(error.error || 'Erro ao criar reserva');
        this.loading = false;
      }
    });
  }

  finalizarReserva(id: number): void {
    if (!confirm('Deseja finalizar esta reserva?')) return;
    
    this.reservaService.finalizar(id).subscribe({
      next: () => {
        alert('Reserva finalizada com sucesso!');
        this.carregarReservas();
      },
      error: (error) => {
        console.error('Erro ao finalizar reserva:', error);
        alert(error.error || 'Erro ao finalizar reserva');
      }
    });
  }

  cancelarReserva(id: number): void {
    const motivo = prompt('Informe o motivo do cancelamento:');
    if (!motivo) return;
    
    this.reservaService.cancelar(id, motivo).subscribe({
      next: () => {
        alert('Reserva cancelada com sucesso!');
        this.carregarReservas();
      },
      error: (error) => {
        console.error('Erro ao cancelar reserva:', error);
        alert(error.error || 'Erro ao cancelar reserva');
      }
    });
  }

  alterarHospedes(reserva: Reserva): void {
    const quantidade = prompt(`Quantidade atual: ${reserva.quantidadeHospede}\nNova quantidade:`, 
      reserva.quantidadeHospede.toString());
    
    if (!quantidade || isNaN(+quantidade)) return;
    
    const motivo = prompt('Motivo da alteração:');
    if (!motivo) return;
    
    this.reservaService.alterarQuantidadeHospedes(reserva.id!, +quantidade, motivo).subscribe({
      next: () => {
        alert('Quantidade de hóspedes alterada com sucesso!');
        this.carregarReservas();
      },
      error: (error) => {
        console.error('Erro ao alterar hóspedes:', error);
        alert(error.error || 'Erro ao alterar quantidade de hóspedes');
      }
    });
  }

  filtrar(status: StatusReserva | 'TODAS'): void {
    this.filtroStatus = status;
    this.carregarReservas();
  }

  getStatusClass(status: StatusReserva): string {
    switch (status) {
      case StatusReserva.ATIVA:
        return 'status-ativa';
      case StatusReserva.FINALIZADA:
        return 'status-finalizada';
      case StatusReserva.CANCELADA:
        return 'status-cancelada';
      default:
        return '';
    }
  }

  formatarData(data: Date | string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}
