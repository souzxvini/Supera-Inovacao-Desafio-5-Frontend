import { ResponsePageable } from './../modelo/response-pageable.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Filtro } from '../modelo/filtro.model';
import { Transferencia } from '../modelo/transferencia.model';
import { environment } from 'src/environments/environment';
import { Saldo } from '../modelo/saldo.model';

const API = environment.API

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {

  constructor(
    private http: HttpClient
  ) { }

  buscarTransferencias(filtro: Filtro, page: any, size: any): Observable<ResponsePageable>{
    return this.http.get<ResponsePageable>(
      `${API}/transferencia?dataInicio=${filtro.dataInicio}&dataFim=${filtro.dataFim}&nomeOperadorTransacao=${filtro.nomeOperadorTransacao}&page=${page}&size=${size}`
      );
  }

  buscarSaldos(filtro: Filtro, page: any, size: any): Observable<Saldo>{
    return this.http.get<Saldo>(
      `${API}/transferencia/saldo?dataInicio=${filtro.dataInicio}&dataFim=${filtro.dataFim}&nomeOperadorTransacao=${filtro.nomeOperadorTransacao}&page=${page}&size=${size}`
      );
  }

  buscarNomes(nome: string): Observable<string[]>{
    return this.http.get<string[]>(
      `${API}/transferencia/nomes?nome=${nome}`
      );
  }

}
