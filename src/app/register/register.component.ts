import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject }  from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { AppModule } from '../app.module';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  access_token: any;
  error: any;
  error_message: any;
  name: any;
  email: any;
  phone: any;
  password: any;
  password_confirmation: any;
  constructor(
    @Inject(DOCUMENT) document: Document,
    private http: HttpClient,
    private router: Router,
    private appModule: AppModule,
  ) {}

  submitSignUp()
  {
    this.name = (<HTMLInputElement>document.getElementById("name")).value;
    this.email = (<HTMLInputElement>document.getElementById("email")).value;
    this.phone = ((<HTMLInputElement>document.getElementById("phone")).value).replace(/\D+/g, '');
    this.password = (<HTMLInputElement>document.getElementById("password")).value;
    password: this.password_confirmation = (<HTMLInputElement>document.getElementById("password-confirmation")).value;

    let body = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password
    };

    const url = 'http://localhost/api/auth/register';

    this.http.post<any>(url, body)
      .pipe(
        catchError(err => {return this.appModule.defineErrorsFromResponse(err, err.access_token, this)})
      )
      .subscribe(res => {
        if (!this.appModule.defineErrorsFromResponse(res, true, this)) {
          this.callLoginRoute();
          this.access_token = res.access_token;

          if (this.access_token !== '') {
            localStorage.setItem('access_token', this.access_token);
            this.callLoginRoute();
            this.router.navigate(['posts']);
          }
        }
      })
    ;
  }

  callLoginRoute()
  {
    const email = (<HTMLInputElement>document.getElementById("email")).value;
    const password = (<HTMLInputElement>document.getElementById("password")).value;
    let body = {email: email, password: password};

    const url = 'http://localhost/api/auth/login';
    this.http.post<any>(url, body)
      .pipe(
        catchError(err => {return this.appModule.defineErrorsFromResponse(err, err.access_token, this)})
      )
      .subscribe(res => {
        if (!this.appModule.defineErrorsFromResponse(res, res.access_token, this)) {
          this.access_token = res.access_token;

          if (this.access_token !== '') {
            localStorage.setItem('access_token', this.access_token);
            this.appModule.callMeRoute(this);
            this.router.navigate(['posts']);
          }
        }
      })
    ;
  }
}
