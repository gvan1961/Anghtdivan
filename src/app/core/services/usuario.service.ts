import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UsuarioRequest, UsuarioResponse, AlterarSenha } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private endpoint = 'usuarios';

  constructor(private api: ApiService) {}

  listar(): Observable<UsuarioResponse[]> {
    return this.api.get<UsuarioResponse[]>(this.endpoint);
  }

  buscarPorId(id: number): Observable<UsuarioResponse> {
    return this.api.get<UsuarioResponse>(`${this.endpoint}/${id}`);
  }

  criar(usuario: UsuarioRequest): Observable<UsuarioResponse> {
    return this.api.post<UsuarioResponse>(this.endpoint, usuario);
  }

  atualizar(id: number, usuario: UsuarioRequest): Observable<UsuarioResponse> {
    return this.api.put<UsuarioResponse>(`${this.endpoint}/${id}`, usuario);
  }

  alterarSenha(id: number, dados: AlterarSenha): Observable<void> {
    return this.api.patch<void>(`${this.endpoint}/${id}/alterar-senha`, dados);
  }

  ativarDesativar(id: number, ativo: boolean): Observable<void> {
    return this.api.patch<void>(`${this.endpoint}/${id}/ativar-desativar`, { ativo });
  }

  deletar(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}