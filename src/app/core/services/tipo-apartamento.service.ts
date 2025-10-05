import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TipoApartamento } from '../models/apartamento.model';

@Injectable({
  providedIn: 'root'
})
export class TipoApartamentoService {
  private endpoint = 'tipos-apartamento';

  constructor(private api: ApiService) {}

  listar(): Observable<TipoApartamento[]> {
    return this.api.get<TipoApartamento[]>(this.endpoint);
  }

  buscarPorId(id: number): Observable<TipoApartamento> {
    return this.api.get<TipoApartamento>(`${this.endpoint}/${id}`);
  }

  buscarPorTipo(tipo: 'A' | 'B' | 'C'): Observable<TipoApartamento> {
    return this.api.get<TipoApartamento>(`${this.endpoint}/tipo/${tipo}`);
  }

  criar(tipoApartamento: TipoApartamento): Observable<TipoApartamento> {
    return this.api.post<TipoApartamento>(this.endpoint, tipoApartamento);
  }

  atualizar(id: number, tipoApartamento: TipoApartamento): Observable<TipoApartamento> {
    return this.api.put<TipoApartamento>(`${this.endpoint}/${id}`, tipoApartamento);
  }

  deletar(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}