import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
      case 0:
        module.error = 'error';
        break;
      case 400:
        module.error = 'message';
        module.error_message = res.message;
        break;
      case 404:
        module.error = 'error';
        break;
      case 405:
        module.error = 'error';
        break;
      case 422:
        module.error = 'message';
        module.error_message = this.mountAllErrorMessages(res.error.errors);
        break;
      case 500:
        module.error = 'error';
        break;
      default:
        module.error = 'error';
        break;
    }

    return true;
  }

  mountFirstErrorMessage (errors: Array<string>): string
  {
    var error_message = '';
    for (var error in errors) {
      error_message += errors[error] + ". " ;
      break;
    }

    return error_message;
  }

  mountAllErrorMessages (errors: Array<string>): string
  {
    var error_message = '';
    for (var error in errors) {
      error_message += errors[error] + ". <br>";
    }

    return error_message;
  }

  mountAllErrorMessagesAsList (errors: Array<string>): string
  {
    var error_message = '<ul class="text-align: left;">';
    for (var error in errors) {
      error_message += "<li>" + errors[error] + "</li>";
    }
    error_message += '</li>'

    return error_message;
  }
}
