import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject }  from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  access_token: any;
  constructor(@Inject(DOCUMENT) document: Document, private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  submitLogin()
  {
    this.access_token = localStorage.getItem('access_token') ?? '';

    if (this.access_token !== '') {
      this.router.navigate(['posts']);
      return;
    }

    const email = (<HTMLInputElement>document.getElementById("email")).value;
    const password = (<HTMLInputElement>document.getElementById("password")).value;
    let body = {email: email, password: password};

    const url = 'http://localhost/api/auth/login';
    this.http.post<any>(url, body).subscribe(res => {
      this.access_token = res.access_token

      if (this.access_token !== '') {
        localStorage.setItem('access_token', this.access_token);
        this.router.navigate(['posts']);
      }
    });
  }
}
