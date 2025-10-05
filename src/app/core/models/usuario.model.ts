export interface UsuarioRequest {
  nome: string;
  username: string;
  email: string;
  password: string;
  ativo: boolean;
  perfisIds?: number[];
  permissoesIds?: number[];
}

export interface UsuarioResponse {
  id: number;
  nome: string;
  username: string;
  email: string;
  ativo: boolean;
  dataCriacao: Date;
  ultimoAcesso?: Date;
  perfis: any[];
  permissoes: any[];
}

export interface AlterarSenha {
  senhaAtual: string;
  novaSenha: string;
}