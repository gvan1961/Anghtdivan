import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface ContaAPagar {
  id?: number;
  descricao: string;
  valor: number;
  valorPago: number;
  saldo: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'EM_ABERTO' | 'PAGA' | 'VENCIDA';
  fornecedor?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContaPagarService {
  private endpoint = 'contas-pagar';

  constructor(private api: ApiService) {}

  listar(): Observable<ContaAPagar[]> {
    return this.api.get<ContaAPagar[]>(this.endpoint);
  }

  buscarPorId(id: number): Observable<ContaAPagar> {
    return this.api.get<ContaAPagar>(`${this.endpoint}/${id}`);
  }

  buscarContasEmAberto(): Observable<ContaAPagar[]> {
    return this.api.get<ContaAPagar[]>(`${this.endpoint}/em-aberto`);
  }

  buscarContasVencidas(): Observable<ContaAPagar[]> {
    return this.api.get<ContaAPagar[]>(`${this.endpoint}/vencidas`);
  }

  criar(conta: ContaAPagar): Observable<ContaAPagar> {
    return this.api.post<ContaAPagar>(this.endpoint, conta);
  }

  atualizar(id: number, conta: ContaAPagar): Observable<ContaAPagar> {
    return this.api.put<ContaAPagar>(`${this.endpoint}/${id}`, conta);
  }

  deletar(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}