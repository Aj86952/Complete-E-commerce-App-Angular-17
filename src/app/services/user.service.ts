import { Inject, Injectable, EventEmitter, PLATFORM_ID } from '@angular/core';
import { logIn, signUp } from '../data-type';
import { enviroment } from '../enviroment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
// import { EventEmitter } from 'stream';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public isUserLoggedinError = new EventEmitter<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  userSignup(data: signUp) {
    this.http
      .post(`${enviroment.baseUrl}/users`, data, { observe: 'response' })
      .subscribe(
        (res: any) => {
          console.log('userSignup db res', res);
          localStorage.setItem('user_details', JSON.stringify(res.body));
          this.router.navigate(['/']);
        },
        (err: any) => {
          console.log('User failed to save', err);
        }
      );
  }

  userLogin(data: logIn) {
    this.http
      .get(
        `${enviroment.baseUrl}/users?email=${data.email}&password=${data.password}`,
        { observe: 'response' }
      )
      .subscribe(
        (res: any) => {          
          if(res && res.body && res.body?.length){
            localStorage.setItem('user_details', JSON.stringify(res.body));
            this.router.navigate(['home']);
          } else {
            console.log('User failed to login');
            this.isUserLoggedinError.emit(true);
          }
        },
        (err: any) => {
          console.log('User failed to login', err);
        }
      );
  }

  userAuthReload() {
    //if user is registered & loggedin then again it should not go to registration page until logout.
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('user_details')) {
        this.router.navigate(['/']);
      }
    }
  }
}
