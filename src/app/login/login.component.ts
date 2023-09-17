import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject }  from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  access_token: any;
  error: any;
  error_message: any;
  user_name: any;
  constructor(@Inject(DOCUMENT) document: Document, private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.access_token = localStorage.getItem('access_token') ?? '';
    this.user_name = localStorage.getItem('user_name') ?? '';

    if (
      this.access_token !== ''
      && this.user_name !== ''
    ) {
      this.callMeRoute();
      return;
    }
  }

  submitLogin()
  {
    const email = (<HTMLInputElement>document.getElementById("email")).value;
    const password = (<HTMLInputElement>document.getElementById("password")).value;
    let body = {email: email, password: password};

    const url = 'http://localhost/api/auth/login';
    this.http.post<any>(url, body)
      .pipe(
        catchError(err => {return this.defineErrorForAlerts(err)})
      )
      .subscribe(res => {
        if (!this.defineErrorForAlerts(res))
        {
          this.access_token = res.access_token;

          if (this.access_token !== '') {
            localStorage.setItem('access_token', this.access_token);
            this.callMeRoute();
            this.router.navigate(['posts']);
          }
        }
      })
    ;
  }

  callMeRoute () {
    const url = 'http://localhost/api/auth/me';
    const headers = {
      'Authorization': 'Bearer ' + this.access_token
    }
    const options = {                                                                                                                                                                                 
      headers: new HttpHeaders(headers), 
    };
    
    this.http
      .get<any>(url, options)
      .pipe(
        catchError(err => {return this.router.navigate(['login'])})
      )
      .subscribe(res => {
        if (res !== null) {
          this.user_name = res.data.name
          localStorage.setItem('user_name', this.user_name);
          this.router.navigate(['posts']);
        }
      })
    ;
  }

  defineErrorForAlerts(res: any): any
  {
    if (res == null
      || res == ''
      || res.status == 'undefined'
      || res.status == undefined
    ) {
      if (res.access_token !== null)
      {
        this.error = 'none';
        return false;
      }
      this.error = 'error';
      this.error_message = res;
      return true;
    }

    if (res.status >= 200 && res.status < 300)
    {
      this.error = 'none';
      return false;
    }

    switch (res.status)
    {
      case 401:
        this.error = 'unauthorized';
        break;
      case 0:
        this.error = 'error';
        break;
      case 400:
        this.error = 'message';
        this.error_message = res.message;
        break;
      case 404:
        this.error = 'error';
        break;
      case 405:
        this.error = 'error';
        break;
      case 422:
        this.error = 'message';
        this.error_message = this.getAllErrorMessages(res.error.errors);
        break;
      case 500:
        this.error = 'error';
        break;
      default:
        this.error = 'error';
        break;
    }

    return true;
  }

  getFirstErrorMessage (errors: Array<string>): string
  {
    var error_message = '';
    for (var error in errors) {
      error_message += errors[error] + ". " ;
      break;
    }

    return error_message;
  }

  getAllErrorMessages (errors: Array<string>): string
  {
    var error_message = '';
    for (var error in errors) {
      error_message += errors[error] + "<br>";
    }

    return error_message;
  }

  getAllErrorMessagesAsList (errors: Array<string>): string
  {
    var error_message = '<ul class="text-align: left;">';
    for (var error in errors) {
      error_message += "<li>" + errors[error] + "</li>";
    }
    error_message += '</li>'

    return error_message;
  }
}
