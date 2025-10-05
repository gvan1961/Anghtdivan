import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Dashboard, RelatorioOcupacao, RelatorioFaturamento } from '../models/relatorio.model';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  private endpoint = 'relatorios';

  constructor(private api: ApiService) {}

  gerarDashboard(): Observable<Dashboard> {
    return this.api.get<Dashboard>(`${this.endpoint}/dashboard`);
  }

  gerarRelatorioOcupacao(data: string): Observable<RelatorioOcupacao> {
    return this.api.get<RelatorioOcupacao>(`${this.endpoint}/ocupacao`, { data });
  }

  gerarRelatorioFaturamento(dataInicio: string, dataFim: string): Observable<RelatorioFaturamento> {
    return this.api.get<RelatorioFaturamento>(`${this.endpoint}/faturamento`, {
      dataInicio,
      dataFim
    });
  }

  gerarRelatorioProdutos(dataInicio: string, dataFim: string): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/produtos`, { dataInicio, dataFim });
  }

  gerarRelatorioApartamentos(dataInicio: string, dataFim: string): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/apartamentos`, { dataInicio, dataFim });
  }
}