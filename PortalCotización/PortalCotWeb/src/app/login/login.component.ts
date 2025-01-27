import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import { ServiceService } from '../controller/service.service';
import {URL } from '../config/config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: FormGroup;
  incorrectCredentials: boolean = false;

  constructor(private service: ServiceService, private router: Router, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) { 
    iconRegistry.addSvgIcon(
        'key',
        sanitizer.bypassSecurityTrustResourceUrl('assets/vpn_key-24px (1).svg'));
     iconRegistry.addSvgIcon(
          'Username',
          sanitizer.bypassSecurityTrustResourceUrl('assets/mail_outline-24px.svg'));
  }

  ngOnInit() {
    if(window.localStorage.ACCESS_TOKEN){
      if(window.localStorage.Administrator === "admin"){
        this.service.setAdmin();
      }
      this.router.navigate(["cotización"]);
    }
    this.user = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  async login(frmLogin){
    try {
      let response = await this.service.postResource(URL.API_URL+'/sessions', frmLogin.value)
      if(response.status == 201 || response.status == 200){
        let data = await response.json()
        window.localStorage.setItem("ACCESS_TOKEN", data.token);
        if(data.type === "admin"){
          this.service.setAdmin()
          window.localStorage.setItem("Administrator", data.type);
        }
        this.service.show();
        this.router.navigate(["/cotización"]);
      }else{
        this.incorrectCredentials = true
      }
    } catch (error) {
      console.log(error);
    }
  }
}
