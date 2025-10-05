export interface Apartamento {
  id?: number;
  numeroApartamento: string;
  tipoApartamento: TipoApartamento;
  capacidade: number;
  camasDoApartamento: string;
  status: StatusApartamento;
  tv?: string;
}

export interface TipoApartamento {
  id: number;
  tipo: 'A' | 'B' | 'C';
  descricao: string;
}

export enum StatusApartamento {
  DISPONIVEL = 'DISPONIVEL',
  OCUPADO = 'OCUPADO',
  LIMPEZA = 'LIMPEZA',
  PRE_RESERVA = 'PRE_RESERVA',
  MANUTENCAO = 'MANUTENCAO'
}
