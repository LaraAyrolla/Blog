import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject }  from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { AppModule } from '../app.module';

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
  constructor(
    @Inject(DOCUMENT) document: Document,
    private http: HttpClient,
    private router: Router,
    private appModule: AppModule,
  ) {}

  ngOnInit(): void {
    this.access_token = localStorage.getItem('access_token') ?? '';
    this.user_name = localStorage.getItem('user_name') ?? '';

    if (
      this.access_token !== ''
      && this.user_name !== ''
    ) {
      this.appModule.callMeRoute(this);
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
