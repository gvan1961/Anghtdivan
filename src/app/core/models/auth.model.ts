export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  id: number;
  username: string;
  nome: string;
  email: string;
  perfis: string[];
  permissoes: string[];
}

export interface Usuario {
  id: number;
  username: string;
  nome: string;
  email: string;
  ativo: boolean;
  perfis: Perfil[];
  permissoes: Permissao[];
  dataCriacao?: Date;
  ultimoAcesso?: Date;
}

export interface Perfil {
  id: number;
  nome: string;
  descricao: string;
}

export interface Permissao {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
}