import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Empresa } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private endpoint = 'empresas';

  constructor(private api: ApiService) {}

  listar(): Observable<Empresa[]> {
    return this.api.get<Empresa[]>(this.endpoint);
  }

  buscarPorId(id: number): Observable<Empresa> {
    return this.api.get<Empresa>(`${this.endpoint}/${id}`);
  }

  buscarPorCnpj(cnpj: string): Observable<Empresa> {
    return this.api.get<Empresa>(`${this.endpoint}/cnpj/${cnpj}`);
  }

  buscarPorNome(nome: string): Observable<Empresa[]> {
    return this.api.get<Empresa[]>(`${this.endpoint}/buscar`, { nome });
  }

  criar(empresa: Empresa): Observable<Empresa> {
    return this.api.post<Empresa>(this.endpoint, empresa);
  }

  atualizar(id: number, empresa: Empresa): Observable<Empresa> {
    return this.api.put<Empresa>(`${this.endpoint}/${id}`, empresa);
  }

  deletar(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}