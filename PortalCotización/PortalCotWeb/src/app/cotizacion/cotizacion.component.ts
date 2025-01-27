import { Component, ViewChild, HostListener } from '@angular/core';
import { ServiceService } from '../controller/service.service';
import {URL } from '../config/config';
import { MatTableDataSource} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { GuardarCotizacionService } from '../guardar-cotizacion/guardar-cotizacion.service';
import { ActivatedRoute } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import { ComponentCanDeactivate } from '../pending-changes.guard';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css']
})

export class CotizacionComponent implements ComponentCanDeactivate {
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort
  public displayedColumns: string[] = ['codigo', 'nombre', 'comentario', 'cantidad', 'precioUnitario', 'precioTotal'];
  public productos;
  public displayedMargenes : string[] = ['descripcion', 'margen'];
  private codigo;
  private cotizacion;
  private productosAux = [];
  public carrito = [];
  public margenes;
  public precioTotalACliente = 0;
  public precioTotalMensual = 0;
  public precioPorUnicaVez = 0;
  public cantidadLicenciasUsuario = 0;
  private constantes = [];
  public changes:boolean = false;
  private licencias = [];
  public redundancia:boolean = false;
  public selectOption;

  @HostListener('window:beforeunload')
  @HostListener('window:hashchange')
  canDeactivate(): boolean {
    return (!this.changes);
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
  }

  constructor(public service: ServiceService, private confirmationDialogService: ConfirmationDialogService, private guardarCotizacionService: GuardarCotizacionService, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.productos = new MatTableDataSource();
    this.margenes = new MatTableDataSource();
    await this.getMargenes();
    await this.getProductos();
    await this.cargarCotizacion();
    this.productos.sort = this.sort;
    this.productos.paginator = this.paginator;
  }


  ngAfterViewInit() {
    this.startSort();
  }

  //Request al servidor backend de los margenes
  async getMargenes(){
    this.margenes.data = await this.service.getResourceAsync(URL.API_URL+"/margen", window.localStorage.token);
  }

  //Request al servidor backend de los productos, se fija si tiene nombre de articulo para decidir si mostrarlo o no y asigna al producto su margen correspondiente.
  async getProductos(){
    const aux = await this.service.getResourceAsync(URL.API_URL+"/productos", window.localStorage.token);
    await aux.forEach(producto =>{
      if(producto.codigo.substring(0, 2) === "CO"){
        this.constantes[producto.codigo] = producto;
      }
      else{
        if(producto.articulo !== null){
          producto.cantidad = "";
          this.margenes.data.forEach(margen => {
            if(producto.margenId === margen._id){
              producto.margenDescripcion = margen.descripcion;
              producto.margenEstandar = margen.margenEstandar;
              if(producto.licenciaDeUsuario){
                producto.precio = producto.costo;
              }
              else{
                producto.precio = (Math.round((producto.costo + (producto.costo * producto.margenEstandar / 100))*100)/100).toFixed(2);
              }
              producto.precioTotal = "0";
              producto.comentario===null?producto.comentario="":false;
              this.productosAux.push(producto);
            }
          });
        }
      }
    });
    this.productos.data = this.productosAux;
  }

  //valida que la cantidad ingresada por el usuario sea un numero > 0 antes de llamar a la funcion calcular
  async validarCalcular(producto){
    this.changes = true;
    let valor = parseInt(producto.cantidad);
    if((!/^\d+$/.test(producto.cantidad) || valor <= 0) && producto.cantidad !== ""){
      this.confirmationDialogService.message('Error', 'Valor ' + producto.cantidad +' incorrecto');
      producto.cantidad = "";
    }
    this.calcularPrecioTotal(producto);
  }

  //calcula el precio total a partir de la cantidad ingresada y llama a funcion para agregar al carrito y calcular el total
  async calcularPrecioTotal(producto){
    if(producto.licenciaDeUsuario){
      this.licencias[producto.codigo] = producto;
      this.calcularLicencias();
    }
    else{
      if(producto.cantidad !== ""){
        producto.precioTotal = (Math.round(parseInt(producto.cantidad) * producto.precio * 100)/100).toFixed(2);
      }
      else{
        producto.precioTotal = 0;
      }
    }
    await this.actualizarCarrito(producto);
    this.calcularTotalCotizacion();  
  }

  //calcula el nuevo valor de todas las licencias ya sea por cambio en cantidad o si cambio redundancia o no
  async calcularLicencias(){
    let cantidadLicencias = 0;
    for(let indice in this.licencias){
      let producto = this.licencias[indice];
      if(this.licencias[indice].cantidad !== ""){
        cantidadLicencias += parseInt(producto.cantidad);
      }
    }
    let costoSoporte; let soporteMinimo = this.constantes["CO050"].costo;
    let soportePorCantidad = this.constantes["CO048"].costo/cantidadLicencias;
    soportePorCantidad>soporteMinimo? costoSoporte = soportePorCantidad: costoSoporte = soporteMinimo;
    for(let indice in this.licencias){
      let producto = this.licencias[indice];
      if(producto.cantidad !== ""){
        let precioUnitario = producto.costo + (this.constantes["CO003"].costo/cantidadLicencias); 
        console.log("1,68", precioUnitario); console.log("producto costo: ",producto.costo);console.log("costante sobre licencia: ",  this.constantes["CO003"].costo/cantidadLicencias);
        if(this.redundancia){ 
          precioUnitario += this.constantes["CO010"].costo + (this.constantes["CO004"].costo/cantidadLicencias);
        }
        precioUnitario = precioUnitario/(1-producto.margenEstandar/100) + costoSoporte * 2;
        producto.precioTotal = (Math.round(precioUnitario * producto.cantidad*100)/100).toFixed(2);
        //aca calcular la suma con los margenes
      }
      else{
        producto.precioTotal = 0;
      }
      this.editarProducto(producto);
    }
    console.log(cantidadLicencias);
    await this.calcularPrecioPorUnicaVez(cantidadLicencias);
    this.calcularTotalCotizacion();  
  }

  async calcularPrecioPorUnicaVez(cantidadLicencias){
    cantidadLicencias <= 100?this.precioPorUnicaVez = 550:this.precioPorUnicaVez = 550 + (cantidadLicencias - 100)*0.5;
    if(cantidadLicencias > 0){
      let productoUnicaVez = 
      {codigo: "PUV",
      articulo: "Precio por unica vez", 
      precioTotal: this.precioPorUnicaVez,
      cantidad: "1",
      precio: this.precioPorUnicaVez};
      this.actualizarCarrito(productoUnicaVez);
    }
  }
  //edita Un producto en la tabla, sirve para cuando se sube la cantidad total de licencias y se tiene que calcular el nuevo valor de todas las licencias
  editarProducto(producto){
    this.productos.data.forEach(element => {
      if(element.codigo === producto.codigo){
        element = producto;
      }
    });
  }

  //calcula el precio total de la cotizacion ya que se agrego una nueva cantidad o cambio algun margen
  async calcularTotalCotizacion(){
    let precioCliente = 0;
    let precioMensual = 0;
    this.carrito.forEach(producto => {
      if(producto.codigo.substring(0, 2) === "SW"){
        precioMensual += parseFloat(producto.precioTotal);
      }
      else{
        precioCliente += parseFloat(producto.precioTotal);
      }
    });
    this.precioTotalACliente = Math.round(precioCliente*100)/100;
    this.precioTotalMensual  =Math.round(precioMensual*100)/100;
  };

  //agrega un producto nuevo al carrito, lo elimina o cambia la cantidad ingresada
  async actualizarCarrito(producto){
    let auxBool = false;
    for (let index = 0; index < this.carrito.length; index++) {
      if(this.carrito[index].codigo === producto.codigo){
        this.carrito[index] = producto;
        await producto.cantidad!==""?auxBool = true:this.carrito.splice(index, 1);  
      }
    }
    !auxBool&&producto.cantidad?this.carrito.push(producto):false;
  }
  
  //Aplica el filtro a la tabla de productos
  async aplicarFiltro() {
    let productosAux2 = [];let opcion = "";
    let codigoFiltro : any = document.getElementById("filtroCodigo");
    let nombreFiltro : any = document.getElementById("filtroNombre");
    let comentarioFiltro : any = document.getElementById("filtroComentario");
    if(this.selectOption){
      if(this.selectOption === "Hardware"){
        opcion = "HW";
      }
      if(this.selectOption === "Software"){
        opcion = "SW";
      }
      if(this.selectOption === "Todos"){
        opcion = "";
      }
    }
    //this.productos.data.splice(0,this.productos.data.length);
    await this.productosAux.forEach(element => {
      if(element.codigo.toLowerCase().includes(codigoFiltro.value.toLowerCase()) 
      && element.nombre.toLowerCase().includes(nombreFiltro.value.toLowerCase()) 
      && element.comentario.toLowerCase().includes(comentarioFiltro.value.toLowerCase())
      && element.codigo.toLowerCase().includes(opcion.toLocaleLowerCase())){
        productosAux2.push(element);
      }
    });
    this.productos.data = productosAux2;
  }

  //Metodo que Actualiza la lista de productos a partir de cotizacion guardada o cambio de margen
  async actualizarProductos(hide:boolean){
    await this.productos.data.forEach(producto =>{
      this.margenes.data.forEach(margen => {
        if(producto.margenId === margen._id){
          producto.margenDescripcion = margen.descripcion;
          producto.margenEstandar = margen.margenEstandar;
          //las licencias de usuario se actualizan con el metodo calcularLicencias por eso solo tienen que actualizar el margen
          if(!producto.licenciaDeUsuario){
            producto.precio = (Math.round((producto.costo + (producto.costo * producto.margenEstandar / 100))*100)/100).toFixed(2);
            producto.cantidad?
            producto.precioTotal = (Math.round(parseInt(producto.cantidad) * producto.precio * 100)/100).toFixed(2):
            producto.precioTotal = 0;
            producto.comentario===null?producto.comentario="":false;
          }
        }
      });
    });
    await this.calcularLicencias();
    this.calcularTotalCotizacion();
    hide?this.showOrHideMargenes():false;
  }

  //muestra o oculta la tarjeta con la tabla de margenes
  showOrHideMargenes(){
    const margenes =  document.getElementById("margenes");
    margenes.hidden = !margenes.hidden;
  }

  //abre el modal (componente guardar-cotizacion)
  guardarCotizacion(){
    this.guardarCotizacionService.show(this.margenes.data, this.carrito, this.cotizacion, this.redundancia);
  }

  //metodo que se fija si se necesita cargar una cotizacion guardada o no, si se necesita hace el request para obtenerla
  async cargarCotizacion(){
    this.route.queryParams.subscribe(params => {
      this.codigo = params['codigo'];
    });
    if(this.codigo){
      this.cotizacion = await this.service.getResourceAsync(URL.API_URL+"/cotizacion/"+this.codigo, window.localStorage.token);
      this.cotizacion = this.cotizacion[0];
      this.redundancia = this.cotizacion.redundancia;
      this.cotizacion.carrito.forEach(element => {
        this.productos.data.forEach(producto => {
          if(element.producto === producto._id){
            producto.cantidad = element.cantidad;
            this.calcularPrecioTotal(producto);
          }
        });
      });
      this.cotizacion.margenes.forEach(element => {
        this.margenes.data.forEach(margen => {
          if(element.margen === margen._id){
            margen.margenEstandar = element.cantidad;
          }
        });
      });
      this.actualizarProductos(false);
    }
  }      

  //Exoporta el carrito a un formato excel descargable
  exportar = function() {
    //headers de las columnas
    var CsvString = "Codigo;Nombre;Precio;Cantidad;Precio Total;\r\n";
    this.carrito.forEach(function(producto) {
      //voy poniendo datos en las filas
      CsvString += 
      producto.codigo + ";" 
      + producto.articulo +";" 
      + producto.precio+ ";" 
      + producto.cantidad + ";" 
      + producto.precioTotal + ";";
      CsvString += "\r\n";
    });
    CsvString += "\r\n";
    //Pongo el precio final
    CsvString += "Precio Final Total;;;;" + this.precioTotalACliente + "\r\n";
    CsvString = "data:application/csv," + escape(CsvString);
    var x = document.createElement("A");
    x.setAttribute("href", CsvString );
    x.setAttribute("download","Cotizacion.csv");
    document.body.appendChild(x);
    x.click();
  } 

  //arregla configuracion para que se puedan ordenar bien las columnas de la tabla de productos
  startSort(){
    this.productos.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'codigo': {
          let number = parseInt(item[property].slice(2,6));
          return number;
        }
        case 'precioUnitario': {
          let number = item["costo"];
          return number;
        }
        case 'precioTotal':{
          let number = parseInt(item["precioTotal"]);
          return number;
        }
        default: {
          return item[property];
        }
      }
    };
  }

  //valida que el margen nuevo ingresado sea un numero mayor a 0
  async validarMargen(margen){
    let valor = parseInt(margen.margenEstandar);
    if((!/^\d*\.?\d*$/.test(margen.margenEstandar) || valor < 0)){
      this.confirmationDialogService.message('Error', 'Valor ' + margen.margenEstandar +' incorrecto');
      margen.margenEstandar = "";
    }
  }  
}

