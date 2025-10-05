import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface ContaAReceber {
  id?: number;
  reservaId: number;
  clienteId?: number;
  empresaId?: number;
  valor: number;
  valorPago: number;
  saldo: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'EM_ABERTO' | 'PAGA' | 'VENCIDA';
  descricao: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContaReceberService {
  private endpoint = 'contas-receber';

  constructor(private api: ApiService) {}

  listar(): Observable<ContaAReceber[]> {
    return this.api.get<ContaAReceber[]>(this.endpoint);
  }

  buscarPorId(id: number): Observable<ContaAReceber> {
    return this.api.get<ContaAReceber>(`${this.endpoint}/${id}`);
  }

  buscarContasEmAberto(): Observable<ContaAReceber[]> {
    return this.api.get<ContaAReceber[]>(`${this.endpoint}/em-aberto`);
  }

  buscarContasVencidas(): Observable<ContaAReceber[]> {
    return this.api.get<ContaAReceber[]>(`${this.endpoint}/vencidas`);
  }

  buscarPorCliente(clienteId: number): Observable<ContaAReceber[]> {
    return this.api.get<ContaAReceber[]>(`${this.endpoint}/cliente/${clienteId}`);
  }

  buscarPorEmpresa(empresaId: number): Observable<ContaAReceber[]> {
    return this.api.get<ContaAReceber[]>(`${this.endpoint}/empresa/${empresaId}`);
  }

  criar(conta: ContaAReceber): Observable<ContaAReceber> {
    return this.api.post<ContaAReceber>(this.endpoint, conta);
  }

  atualizar(id: number, conta: ContaAReceber): Observable<ContaAReceber> {
    return this.api.put<ContaAReceber>(`${this.endpoint}/${id}`, conta);
  }

  deletar(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}