import { Produto } from './produto.model';

export interface VendaReservaRequest {
  reservaId: number;
  itens: ItemVendaRequest[];
}

export interface ItemVendaRequest {
  produtoId: number;
  quantidade: number;
}

export interface NotaVenda {
  id: number;
  dataHoraVenda: Date | string;
  tipoVenda: TipoVenda;
  reservaId?: number;
  total: number;
  itens: ItemVenda[];
}

export interface ItemVenda {
  id: number;
  produto: Produto;
  quantidade: number;
  valorUnitario: number;
  totalItem: number;
}

export enum TipoVenda {
  VISTA = 'VISTA',
  APARTAMENTO = 'APARTAMENTO'
}