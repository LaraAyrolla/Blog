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
  user_name: any;
  user_email: any;
  user_password: any;
  constructor(
    @Inject(DOCUMENT) document: Document,
    private http: HttpClient,
    private router: Router,
    private appModule: AppModule,
  ) {}

  submitSignUp()
  {
    this.user_name = (<HTMLInputElement>document.getElementById("name")).value;
    this.user_email = (<HTMLInputElement>document.getElementById("email")).value;
    const phone = ((<HTMLInputElement>document.getElementById("phone")).value).replace(/\D+/g, '');
    this.user_password = (<HTMLInputElement>document.getElementById("password")).value;

    let body = {
      name: this.user_name,
      email: this.user_email,
      phone: phone,
      password: this.user_password
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
