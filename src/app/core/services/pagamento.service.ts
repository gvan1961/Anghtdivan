import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Pagamento } from '../models/pagamento.model';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {
  private endpoint = 'pagamentos';

  constructor(private api: ApiService) {}

  processar(pagamento: Pagamento): Observable<Pagamento> {
    return this.api.post<Pagamento>(this.endpoint, pagamento);
  }

  buscarPorReserva(reservaId: number): Observable<Pagamento[]> {
    return this.api.get<Pagamento[]>(`${this.endpoint}/reserva/${reservaId}`);
  }

  buscarPagamentosDoDia(data: string): Observable<Pagamento[]> {
    return this.api.get<Pagamento[]>(`${this.endpoint}/do-dia`, { data });
  }

  buscarPorPeriodo(inicio: string, fim: string): Observable<Pagamento[]> {
    return this.api.get<Pagamento[]>(`${this.endpoint}/periodo`, { inicio, fim });
  }

  gerarResumoDoDia(data: string): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/resumo-do-dia`, { data });
  }
}