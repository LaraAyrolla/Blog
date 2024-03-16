import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PostsComponent } from './posts/posts.component';

interface Component {
  error: any,
  error_message: any
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    PostsComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      { path: 'login', component: LoginComponent },
      { path: 'sign-up', component: RegisterComponent },
      { path: 'posts', component: PostsComponent },
    ]),
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { 
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  defineErrorsFromResponse(res: any, requiredProperty: any, module: Component): any
  {
    if (!res || res.status == undefined) {
      if (requiredProperty) {
        module.error = 'none';
        return false;
      }

      module.error = 'error';
      module.error_message = res;
      return true;
    }

    if (res.status >= 200 && res.status < 300) {
      module.error = 'none';
      return false;
    }

    switch (res.status) {
      case 401:
        module.error = 'unauthorized';
        break;
      case 400:
        module.error = 'message';
        module.error_message = res.message;
        break;
      case 422:
        module.error = 'message';
        module.error_message = this.mountAllErrorMessages(res.error.errors);
        break;
      default:
        module.error = 'error';
        break;
    }

    return true;
  }

  mountFirstErrorMessage (errors: Array<string>): string
  {
    let error_message = '';
    for (let error in errors) {
      error_message += errors[error] + ". " ;
      break;
    }

    return error_message;
  }

  mountAllErrorMessages (errors: Array<string>): string
  {
    let error_message = '';
    for (let error in errors) {
      error_message += errors[error] + ". <br>";
    }

    return error_message;
  }

  mountAllErrorMessagesAsList (errors: Array<string>): string
  {
    let error_message = '<ul class="text-align: left;">';
    for (let error in errors) {
      error_message += "<li>" + errors[error] + "</li>";
    }
    error_message += '</li>'

    return error_message;
  }

  callMeRoute (module: any) {
    const url = 'http://localhost/api/auth/me';
    const headers = {
      'Authorization': 'Bearer ' + module.access_token
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
          module.user_name = res.data.name
          localStorage.setItem('user_name', module.user_name);
          this.router.navigate(['posts']);
        }
      })
    ;
  }
}
