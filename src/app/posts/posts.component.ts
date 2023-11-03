import { Component, ViewEncapsulation} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject }  from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PostsComponent {
  access_token: any;
  posts: any;
  user_name: any;
  error: any;
  error_message: any;
  constructor(@Inject(DOCUMENT) document: Document, private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.access_token = localStorage.getItem('access_token') ?? '';
    this.user_name = localStorage.getItem('user_name') ?? '';

    if (this.access_token !== '' && this.user_name !== '') {
      this.user_name = this.user_name.split(" ")[0]

      const url = 'http://localhost/api/post';
      const headers = {
        'Authorization': 'Bearer ' + this.access_token
      }
      const options = {                                                                                                                                                                                 
        headers: new HttpHeaders(headers), 
      };

      this.http
        .get<any>(url, options)
        .pipe(
          catchError( err => {return this.router.navigate(['login'])})
        )
        .subscribe(res => {
          this.posts = res.data;

          if (!Array.isArray(this.posts)) {
            this.router.navigate(['login']);
          }
        })
      ;

      return;
    }

    this.router.navigate(['login']);
  }

  submitLogout()
  {
    this.access_token = localStorage.getItem('access_token') ?? '';
    this.user_name = localStorage.getItem('user_name') ?? '';

    if (this.access_token !== '' && this.user_name !== '') {
      this.user_name = this.user_name.split(" ")[0]

      const url = 'http://localhost/api/auth/logout';
      const headers = {
        'Authorization': 'Bearer ' + this.access_token
      }
      const options = {                                                                                                                                                                                 
        headers: new HttpHeaders(headers), 
      };

      this.http
        .post<any>(url, '', options)
        .pipe(
          catchError( err => {return this.defineErrorForAlerts(err)})
        )
        .subscribe(res => {
          if (!this.defineErrorForAlerts(res)) {
            this.access_token = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_name');
            this.router.navigate(['login']);
          }
        })
      ;
    }
  }

  defineErrorForAlerts(res: any): any
  {
    if (!res || res.status == undefined) {
      if (res.message) {
        this.error = 'none';
        return false;
      }

      this.error = 'error';
      this.error_message = res;
      return true;
    }

    if (res.status >= 200 && res.status < 300) {
      this.error = 'none';
      return false;
    }

    switch (res.status) {
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
      error_message += errors[error] + ". <br>";
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
