import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ExtratoDetalhado } from '../models/extrato.model';

@Injectable({
  providedIn: 'root'
})
export class ExtratoService {
  private endpoint = 'extratos';

  constructor(private api: ApiService) {}

  gerarExtratoDetalhado(reservaId: number): Observable<ExtratoDetalhado> {
    return this.api.get<ExtratoDetalhado>(`${this.endpoint}/reserva/${reservaId}/detalhado`);
  }

  buscarExtratosPorReserva(reservaId: number): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/reserva/${reservaId}`);
  }

  buscarHistoricoPorReserva(reservaId: number): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/reserva/${reservaId}/historico`);
  }

  buscarReservasPorApartamento(numeroApartamento: string): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/apartamento/${numeroApartamento}`);
  }
}