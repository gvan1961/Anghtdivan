import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface PerfilRequest {
  nome: string;
  descricao: string;
  permissoesIds: number[];
}

export interface PerfilResponse {
  id: number;
  nome: string;
  descricao: string;
  permissoes: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private endpoint = 'perfis';

  constructor(private api: ApiService) {}

  listar(): Observable<PerfilResponse[]> {
    return this.api.get<PerfilResponse[]>(this.endpoint);
  }

  buscarPorId(id: number): Observable<PerfilResponse> {
    return this.api.get<PerfilResponse>(`${this.endpoint}/${id}`);
  }

  criar(perfil: PerfilRequest): Observable<PerfilResponse> {
    return this.api.post<PerfilResponse>(this.endpoint, perfil);
  }

  atualizar(id: number, perfil: PerfilRequest): Observable<PerfilResponse> {
    return this.api.put<PerfilResponse>(`${this.endpoint}/${id}`, perfil);
  }

  deletar(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}