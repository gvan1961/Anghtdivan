import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Apartamento, StatusApartamento } from '../models/apartamento.model';

@Injectable({
  providedIn: 'root'
})
export class ApartamentoService {
  private endpoint = 'apartamentos';

  constructor(private api: ApiService) {}

  listar(): Observable<Apartamento[]> {
    return this.api.get<Apartamento[]>(this.endpoint);
  }

  buscarPorId(id: number): Observable<Apartamento> {
    return this.api.get<Apartamento>(`${this.endpoint}/${id}`);
  }

  buscarPorNumero(numero: string): Observable<Apartamento> {
    return this.api.get<Apartamento>(`${this.endpoint}/numero/${numero}`);
  }

  buscarDisponiveis(): Observable<Apartamento[]> {
    return this.api.get<Apartamento[]>(`${this.endpoint}/disponiveis`);
  }

  buscarOcupados(): Observable<Apartamento[]> {
    return this.api.get<Apartamento[]>(`${this.endpoint}/ocupados`);
  }

  buscarPorStatus(status: StatusApartamento): Observable<Apartamento[]> {
    return this.api.get<Apartamento[]>(`${this.endpoint}/status/${status}`);
  }

  buscarDisponiveisParaPeriodo(checkin: string, checkout: string): Observable<Apartamento[]> {
    return this.api.get<Apartamento[]>(`${this.endpoint}/disponiveis-periodo`, {
      checkin,
      checkout
    });
  }

  criar(apartamento: Apartamento): Observable<Apartamento> {
    return this.api.post<Apartamento>(this.endpoint, apartamento);
  }

  atualizar(id: number, apartamento: Apartamento): Observable<Apartamento> {
    return this.api.put<Apartamento>(`${this.endpoint}/${id}`, apartamento);
  }

  atualizarStatus(id: number, status: StatusApartamento): Observable<Apartamento> {
    return this.api.patch<Apartamento>(`${this.endpoint}/${id}/status`, null, { status });
  }
}