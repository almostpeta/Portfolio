import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { ServiceService } from '../app/controller/service.service';
import {URL} from './config/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PortalCotWeb';

  async ngOnInit(){
    if(!window.localStorage.ACCESS_TOKEN){
      this.service.hide();
      this.router.navigate(["login"]);
    }else{
      let response = await this.service.getResourceAsync(URL.API_URL+'/sessions?token=' +
      window.localStorage.ACCESS_TOKEN, window.localStorage.ACCESS_TOKEN).then(res =>{
        if(!res.error){
          res.type = "admin" ? this.service.setAdmin():false;
          this.service.show();
        }
        else{
          window.localStorage.clear();
          this.service.hide()
          this.router.navigate(["login"])
        }
      });
    }
  }
  
  constructor(private router: Router, public service: ServiceService){}

  logOut(){
    window.localStorage.clear();
    this.service.hide()
    this.router.navigate(["login"])
  }
}


