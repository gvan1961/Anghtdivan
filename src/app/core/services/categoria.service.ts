import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Categoria } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private endpoint = 'categorias';

  constructor(private api: ApiService) {}

  listar(): Observable<Categoria[]> {
    return this.api.get<Categoria[]>(this.endpoint);
  }

  buscarPorId(id: number): Observable<Categoria> {
    return this.api.get<Categoria>(`${this.endpoint}/${id}`);
  }

  buscarPorNome(nome: string): Observable<Categoria[]> {
    return this.api.get<Categoria[]>(`${this.endpoint}/buscar`, { nome });
  }

  criar(categoria: Categoria): Observable<Categoria> {
    return this.api.post<Categoria>(this.endpoint, categoria);
  }

  atualizar(id: number, categoria: Categoria): Observable<Categoria> {
    return this.api.put<Categoria>(`${this.endpoint}/${id}`, categoria);
  }

  deletar(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}