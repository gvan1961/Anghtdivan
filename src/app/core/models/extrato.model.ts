export interface ExtratoDetalhado {
  reservaId: number;
  numeroApartamento: string;
  tipoApartamento: string;
  clienteNome: string;
  clienteCpf: string;
  quantidadeHospede: number;
  dataCheckin: Date | string;
  dataCheckout: Date | string;
  quantidadeDiarias: number;
  statusReserva: string;
  historicoHospedes: HistoricoHospede[];
  lancamentos: Lancamento[];
  totalDiarias: number;
  totalProdutos: number;
  totalHospedagem: number;
  totalRecebido: number;
  desconto: number;
  saldoDevedor: number;
}

export interface HistoricoHospede {
  id: number;
  dataHora: Date | string;
  quantidadeAnterior: number;
  quantidadeNova: number;
  motivo?: string;
}

export interface Lancamento {
  id: number;
  dataHora: Date | string;
  tipo: string;
  descricao: string;
  quantidade?: number;
  valorUnitario: number;
  totalLancamento: number;
  saldoAcumulado: number;
  notaVendaId?: number;
}