import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class ServiceService {
  private lastPublicacion;

  visible: boolean = true;
  isAdmin: boolean = false;
  constructor() { }

  //Para los metodos get
  //endpoint es toda la url completa
  //Si tiene parametros lo mismo, el parametro va en la url al igual que postman
  async getResourceAsync(endpoint, token) {
    var json;
    let resource = await fetch(endpoint, {
      method: "GET"
    })
      .then(res => {
        return res.json()
      })
    return resource;
  }

  //Para los metodos delete
  async deleteResource(endpoint){
    let resource = fetch(endpoint, {
      method: "DELETE",
    }).then(res => {
      return res;
    });
    return resource;
  }

  //Para los metodos POST
  postResourceAsync(endpoint, json) {
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    });
  }

  //Para los metodos POST (USAR ESTE)
  async postResource(endpoint, json) {
    let resource = await this.postResourceAsync(endpoint, json)
      .then(res => {
        return res
      })
    return resource;
  }

  async putResource(endpoint, json, token) {
    let resource = await this.putResourceAsync(endpoint, json, token)
      .then(res => {
        return res
      })
    return resource;
  }

  async putResourceAsync(endpoint, json, token) {
    return fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json)
    })
  }

  hide() { this.visible = false; this.isAdmin = false}

  show() { this.visible = true; }

  setAdmin() { this.isAdmin = true; }
}
