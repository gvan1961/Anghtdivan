export interface Dashboard {
  data: Date | string;
  apartamentosOcupados: number;
  apartamentosDisponiveis: number;
  taxaOcupacao: number;
  totalHospedes: number;
  receitaDia: number;
  receitaMes: number;
  pagamentosRecebidos: number;
  contasReceber: number;
  checkInsHoje: number;
  checkOutsHoje: number;
  reservasAtivas: number;
  produtosSemEstoque: number;
  produtosEstoqueBaixo: number;
}

export interface RelatorioOcupacao {
  data: Date | string;
  totalApartamentos: number;
  apartamentosOcupados: number;
  apartamentosDisponiveis: number;
  apartamentosLimpeza: number;
  apartamentosManutencao: number;
  taxaOcupacao: number;
  totalHospedes: number;
  receitaDiaria: number;
}

export interface RelatorioFaturamento {
  dataInicio: Date | string;
  dataFim: Date | string;
  receitaDiarias: number;
  receitaProdutos: number;
  receitaTotal: number;
  pagamentoDinheiro: number;
  pagamentoPix: number;
  pagamentoCartaoDebito: number;
  pagamentoCartaoCredito: number;
  pagamentoTransferencia: number;
  pagamentoFaturado: number;
  quantidadeReservas: number;
  quantidadeCheckIns: number;
  quantidadeCheckOuts: number;
  quantidadeCancelamentos: number;
  ticketMedio: number;
  mediaHospedes: number;
  mediaDiarias: number;
}