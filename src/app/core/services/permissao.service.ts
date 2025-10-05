import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface PermissaoRequest {
  nome: string;
  descricao: string;
  categoria: string;
}

export interface PermissaoResponse {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
}

@Injectable({
  providedIn: 'root'
})
export class PermissaoService {
  private endpoint = 'permissoes';

  constructor(private api: ApiService) {}

  listar(): Observable<PermissaoResponse[]> {
    return this.api.get<PermissaoResponse[]>(this.endpoint);
  }

  buscarPorId(id: number): Observable<PermissaoResponse> {
    return this.api.get<PermissaoResponse>(`${this.endpoint}/${id}`);
  }

  listarPorCategoria(categoria: string): Observable<PermissaoResponse[]> {
    return this.api.get<PermissaoResponse[]>(`${this.endpoint}/categoria/${categoria}`);
  }

  criar(permissao: PermissaoRequest): Observable<PermissaoResponse> {
    return this.api.post<PermissaoResponse>(this.endpoint, permissao);
  }

  atualizar(id: number, permissao: PermissaoRequest): Observable<PermissaoResponse> {
    return this.api.put<PermissaoResponse>(`${this.endpoint}/${id}`, permissao);
  }

  deletar(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}