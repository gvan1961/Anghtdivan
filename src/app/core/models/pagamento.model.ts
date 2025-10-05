export interface Pagamento {
  id?: number;
  reservaId?: number;
  reserva?: {  // Adicionar quando vier populado do backend
    id: number;
    cliente: {
      nome: string;
    };
  };
  valor: number;
  formaPagamento: FormaPagamento;
  dataHoraPagamento?: Date | string;
  observacao?: string;
}

export enum FormaPagamento {
  DINHEIRO = 'DINHEIRO',
  PIX = 'PIX',
  CARTAO_DEBITO = 'CARTAO_DEBITO',
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  TRANSFERENCIA_BANCARIA = 'TRANSFERENCIA_BANCARIA',
  FATURADO = 'FATURADO'
}
