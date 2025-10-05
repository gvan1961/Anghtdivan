import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Reserva, ReservaRequest } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private endpoint = 'reservas';

  constructor(private api: ApiService) {}

  listar(): Observable<Reserva[]> {
    return this.api.get<Reserva[]>(this.endpoint);
  }

  buscarPorId(id: number): Observable<Reserva> {
    return this.api.get<Reserva>(`${this.endpoint}/${id}`);
  }

  buscarAtivas(): Observable<Reserva[]> {
    return this.api.get<Reserva[]>(`${this.endpoint}/ativas`);
  }

  buscarCheckinsDoDia(data: string): Observable<Reserva[]> {
    return this.api.get<Reserva[]>(`${this.endpoint}/checkins-do-dia`, { data });
  }

  buscarCheckoutsDoDia(data: string): Observable<Reserva[]> {
    return this.api.get<Reserva[]>(`${this.endpoint}/checkouts-do-dia`, { data });
  }

  buscarPorPeriodo(inicio: string, fim: string): Observable<Reserva[]> {
    return this.api.get<Reserva[]>(`${this.endpoint}/periodo`, { inicio, fim });
  }

  criar(reserva: ReservaRequest): Observable<Reserva> {
    return this.api.post<Reserva>(this.endpoint, reserva);
  }

  alterarQuantidadeHospedes(id: number, quantidade: number, motivo?: string): Observable<Reserva> {
    return this.api.patch<Reserva>(`${this.endpoint}/${id}/alterar-hospedes`, null, {
      quantidade,
      motivo
    });
  }

  finalizar(id: number): Observable<Reserva> {
    return this.api.patch<Reserva>(`${this.endpoint}/${id}/finalizar`, null);
  }

  cancelar(id: number, motivo: string): Observable<Reserva> {
    return this.api.patch<Reserva>(`${this.endpoint}/${id}/cancelar`, null, { motivo });
  }
}