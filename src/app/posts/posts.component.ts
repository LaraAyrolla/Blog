import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject }  from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {
  access_token: any;
  posts: any;
  constructor(@Inject(DOCUMENT) document: Document, private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    let access_token = localStorage.getItem('access_token') ?? '';

    if (access_token !== ''){
        const url = 'http://localhost/api/post';
        const headers = {
          'Authorization': 'Bearer ' + this.access_token,
        }
        const options = {                                                                                                                                                                                 
          headers: new HttpHeaders(headers), 
        };

        this.http.get<any>(url, options).subscribe(res => {
          this.posts = res.data
        });

        return;
    }

    this.router.navigate(['login']);
  }
}
