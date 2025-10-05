import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private endpoint = 'produtos';

  constructor(private api: ApiService) {}

  listar(): Observable<Produto[]> {
    return this.api.get<Produto[]>(this.endpoint);
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.api.get<Produto>(`${this.endpoint}/${id}`);
  }

  buscarPorNome(nome: string): Observable<Produto[]> {
    return this.api.get<Produto[]>(`${this.endpoint}/buscar`, { nome });
  }

  buscarComEstoqueBaixo(): Observable<Produto[]> {
    return this.api.get<Produto[]>(`${this.endpoint}/estoque-baixo`);
  }

  buscarSemEstoque(): Observable<Produto[]> {
    return this.api.get<Produto[]>(`${this.endpoint}/sem-estoque`);
  }

  criar(produto: Produto): Observable<Produto> {
    return this.api.post<Produto>(this.endpoint, produto);
  }

  atualizar(id: number, produto: Produto): Observable<Produto> {
    return this.api.put<Produto>(`${this.endpoint}/${id}`, produto);
  }

  atualizarEstoque(id: number, quantidade: number): Observable<Produto> {
    return this.api.patch<Produto>(`${this.endpoint}/${id}/estoque`, null, { quantidade });
  }
}