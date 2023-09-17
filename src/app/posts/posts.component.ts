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
  constructor(@Inject(DOCUMENT) document: Document, private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.access_token = localStorage.getItem('access_token') ?? '';
    this.user_name = localStorage.getItem('user_name') ?? '';

    if (
      this.access_token !== ''
      && this.user_name !== ''
    ) {
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
}
