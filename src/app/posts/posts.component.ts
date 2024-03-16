import { Component, ViewEncapsulation} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject }  from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { AppModule } from '../app.module';

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
  success_message: any;
  constructor(
    @Inject(DOCUMENT) document: Document,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private appModule: AppModule,
  ) {}

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
          catchError( err => {return this.appModule.defineErrorsFromResponse(err, err.message, this)})
        )
        .subscribe(res => {
          if (!this.appModule.defineErrorsFromResponse(res, res.message, this)) {
            this.access_token = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_name');

            this.router.navigate(['login']);
          }
        })
      ;
    }
  }

  deletePost(postId: any)
  {
    this.access_token = localStorage.getItem('access_token');
  
    if (
      confirm('Are you sure you want to delete the post? This action cannot be undone!')
      && postId
      && this.access_token
    ) {
      const url = 'http://localhost/api/post/' + postId;
      const headers = {
        'Authorization': 'Bearer ' + this.access_token
      }
      const options = {                                                                                                                                                                                 
        headers: new HttpHeaders(headers), 
      };

      this.http
        .delete<any>(url, options)
        .pipe(
          catchError( err => {return this.appModule.defineErrorsFromResponse(err, err.message, this)})
        )
        .subscribe(res => {
          if (!this.appModule.defineErrorsFromResponse(res, true, this)) {
            alert('Post successfully deleted!');
            window.location.reload();
          }
        })
      ;
    }
  }
}
