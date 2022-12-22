import { Saldo } from './../../modelo/saldo.model';
import { Transferencia } from './../../modelo/transferencia.model';
import { Component, OnInit } from '@angular/core';
import { Filtro } from 'src/app/modelo/filtro.model';
import { TransferenciaService } from 'src/app/services/transferencia.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  form: FormGroup;
  filtro: Filtro = new Filtro()
  listaTransferencias: Transferencia[] = new Array<Transferencia>();
  displayedColumns = ['dados','valor', 'tipo', 'nomeOperadorTransacionado']
  totalTransferencias: number;
  pageSize: number = 9
  page: number = 0;
  listaNomes: string[] = new Array<string>();
  saldo: Saldo = new Saldo()
  nomeOperadorInput: string = ""
  dataFimInput: string = ""
  dataInicioInput: string = ""
  inputDisabled: boolean = true;


  constructor(
    private transferenciaService: TransferenciaService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      dataInicio: [''],
      dataFim:[''],
      nomeOperadorTransacao:['']
    })


    this.form.valueChanges.subscribe(() => {
      if(!this.form.get('dataInicio').value || !this.form.get('dataFim').value){
        this.form.get('dataInicio').setErrors( null)
        this.form.get('dataFim').setErrors( null)
        return;
      }
      if(this.form.get('dataInicio').value.getTime() > this.form.get('dataFim').value.getTime()){
        this.form.get('dataInicio').setErrors({invalido: true})
        this.form.get('dataFim').setErrors({invalido: true})
      }else{
        this.form.get('dataInicio').setErrors( null)
        this.form.get('dataFim').setErrors( null)
      }
    })

    this.buscarTransferencias()
    this.buscarSaldos()
  }

  buscarTransferencias(){
    let filtro = new Filtro()

    if(this.form.get('dataInicio').value){
      filtro.dataInicio = this.datePipe.transform(this.form.get('dataInicio').value, 'dd-MM-yyyy')
    }else{
      filtro.dataInicio = ""
    }

    if(this.form.get('dataFim').value){
      filtro.dataFim = this.datePipe.transform(this.form.get('dataFim').value, 'dd-MM-yyyy')
    }else{
      filtro.dataFim = ""
    }

    if(this.form.get('nomeOperadorTransacao').value){
      filtro.nomeOperadorTransacao = this.form.get('nomeOperadorTransacao').value;

    }else{
      filtro.nomeOperadorTransacao = ""
    }

    this.filtro = filtro

    let subs = this.transferenciaService.buscarTransferencias(filtro, this.page, this.pageSize).subscribe(data => {
      subs.unsubscribe()
      this.listaTransferencias = data.content
      this.totalTransferencias = data.totalElements
    })
  }

  buscarSaldos(){
    let filtro = new Filtro()

    if(this.form.get('dataInicio').value){
      filtro.dataInicio = this.datePipe.transform(this.form.get('dataInicio').value, 'dd-MM-yyyy')
    }else{
      filtro.dataInicio = ""
    }

    if(this.form.get('dataFim').value){
      filtro.dataFim = this.datePipe.transform(this.form.get('dataFim').value, 'dd-MM-yyyy')
    }else{
      filtro.dataFim = ""
    }

    if(this.form.get('nomeOperadorTransacao').value){
      filtro.nomeOperadorTransacao = this.form.get('nomeOperadorTransacao').value;

    }else{
      filtro.nomeOperadorTransacao = ""
    }

    let subs = this.transferenciaService.buscarSaldos(filtro, this.page, this.pageSize).subscribe(data => {
      subs.unsubscribe()
      this.saldo.valorTotal = data.valorTotal
      this.saldo.valorPeriodo = data.valorPeriodo
    })
  }

  onPaginateChange(event: PageEvent) {
    this.page = event.pageIndex
    this.pageSize = event.pageSize

    let subs = this.transferenciaService.buscarTransferencias(this.filtro, this.page, this.pageSize).subscribe(data => {
      subs.unsubscribe()
      this.listaTransferencias = data.content
      this.totalTransferencias = data.totalElements
    })
  }

  filtrar(){
    this.buscarTransferencias();
    this.buscarSaldos()
  }

  limparFiltro(){
    this.form.reset();
    this.transferenciaService.buscarNomes("").subscribe(data => {
      this.listaNomes = data;
    })
  }

  limparInput(){
    this.nomeOperadorInput = ''
    this.transferenciaService.buscarNomes(this.nomeOperadorInput).subscribe(data => {
      this.listaNomes = data;
    })
  }

  buscarNomes(e?: Event){
    const target = e.target as HTMLInputElement;
    const value = target.value
    this.transferenciaService.buscarNomes(value).subscribe(data => {
      this.listaNomes = data;
    })
  }

  aoSelecionarAutoComplete(e?: Event){
    this.form.get("nomeOperadorTransacao").setValue(e)
  }

}
