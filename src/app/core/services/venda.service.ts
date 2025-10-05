import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { VendaReservaRequest, NotaVenda } from '../models/venda.model';

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  private endpoint = 'vendas';

  constructor(private api: ApiService) {}

  adicionarVendaParaReserva(venda: VendaReservaRequest): Observable<NotaVenda> {
    return this.api.post<NotaVenda>(`${this.endpoint}/reserva`, venda);
  }

  buscarVendasDaReserva(reservaId: number): Observable<NotaVenda[]> {
    return this.api.get<NotaVenda[]>(`${this.endpoint}/reserva/${reservaId}`);
  }

  buscarVendasDoDia(data: string): Observable<NotaVenda[]> {
    return this.api.get<NotaVenda[]>(`${this.endpoint}/do-dia`, { data });
  }

  buscarPorPeriodo(inicio: string, fim: string): Observable<NotaVenda[]> {
    return this.api.get<NotaVenda[]>(`${this.endpoint}/periodo`, { inicio, fim });
  }
}