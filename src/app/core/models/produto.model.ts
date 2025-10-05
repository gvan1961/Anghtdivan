export interface Produto {
  id?: number;
  nomeProduto: string;
  quantidade: number;
  valorVenda: number;
  valorCompra: number;
  dataUltimaCompra?: Date | string;
  categoria: Categoria;
}

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
}