import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Diaria, DiariaRequest } from '../models/diaria.model';

@Injectable({
  providedIn: 'root'
})
export class DiariaService {
  private endpoint = 'diarias';

  constructor(private api: ApiService) {}

  listar(): Observable<Diaria[]> {
    return this.api.get<Diaria[]>(this.endpoint);
  }

  buscarPorId(id: number): Observable<Diaria> {
    return this.api.get<Diaria>(`${this.endpoint}/${id}`);
  }

  buscarPorTipo(tipoApartamentoId: number): Observable<Diaria[]> {
    return this.api.get<Diaria[]>(`${this.endpoint}/tipo/${tipoApartamentoId}`);
  }

  buscarPorTipoEQuantidade(tipoApartamentoId: number, quantidade: number): Observable<Diaria> {
    return this.api.get<Diaria>(`${this.endpoint}/tipo/${tipoApartamentoId}/quantidade/${quantidade}`);
  }

  criar(diaria: DiariaRequest): Observable<Diaria> {
    return this.api.post<Diaria>(this.endpoint, diaria);
  }

  atualizar(id: number, diaria: DiariaRequest): Observable<Diaria> {
    return this.api.put<Diaria>(`${this.endpoint}/${id}`, diaria);
  }

  deletar(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}