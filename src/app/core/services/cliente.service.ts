import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private endpoint = 'clientes';

  constructor(private api: ApiService) {}

  listar(): Observable<Cliente[]> {
    return this.api.get<Cliente[]>(this.endpoint);
  }

  buscarPorId(id: number): Observable<Cliente> {
    return this.api.get<Cliente>(`${this.endpoint}/${id}`);
  }

  buscarPorCpf(cpf: string): Observable<Cliente> {
    return this.api.get<Cliente>(`${this.endpoint}/cpf/${cpf}`);
  }

  buscarPorNome(nome: string): Observable<Cliente[]> {
    return this.api.get<Cliente[]>(`${this.endpoint}/buscar`, { nome });
  }

  buscarPorEmpresa(empresaId: number): Observable<Cliente[]> {
    return this.api.get<Cliente[]>(`${this.endpoint}/empresa/${empresaId}`);
  }

  criar(cliente: Cliente): Observable<Cliente> {
    return this.api.post<Cliente>(this.endpoint, cliente);
  }

  atualizar(id: number, cliente: Cliente): Observable<Cliente> {
    return this.api.put<Cliente>(`${this.endpoint}/${id}`, cliente);
  }

  deletar(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}