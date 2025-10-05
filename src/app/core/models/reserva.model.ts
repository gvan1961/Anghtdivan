import { Apartamento } from './apartamento.model';
import { Cliente } from './cliente.model';
import { Diaria } from './diaria.model';

export interface Reserva {
  id?: number;
  apartamento: Apartamento;
  cliente: Cliente;
  quantidadeHospede: number;
  diaria: Diaria;
  dataCheckin: Date | string;
  dataCheckout: Date | string;
  quantidadeDiaria: number;
  totalDiaria: number;
  totalProduto: number;
  totalHospedagem: number;
  totalRecebido: number;
  desconto: number;
  totalApagar: number;
  status: StatusReserva;
}

export interface ReservaRequest {
  apartamentoId: number;
  clienteId: number;
  quantidadeHospede: number;
  dataCheckin: string;
  dataCheckout: string;
}

export enum StatusReserva {
  ATIVA = 'ATIVA',
  CANCELADA = 'CANCELADA',
  FINALIZADA = 'FINALIZADA'
}