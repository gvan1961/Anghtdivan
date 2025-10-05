export interface Cliente {
  id?: number;
  nome: string;
  cpf: string;
  celular: string;
  endereco?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  dataNascimento: Date | string;
  empresaId?: number;
  empresa?: Empresa;
}

export interface Empresa {
  id?: number;
  nomeEmpresa: string;
  cnpj: string;
  contato: string;
  celular: string;
}