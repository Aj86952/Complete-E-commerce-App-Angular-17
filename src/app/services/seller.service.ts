import { enviroment } from './../enviroment';
import { Injectable, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { logIn, signUp } from '../data-type';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  public isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedinError = new EventEmitter<boolean>(false);

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  // sellerSignup(data: signUp): Observable<any> {
  //   // return this.http.post(`http://localhost:3000/sellers`, data);
  //   return this.http.post(`${enviroment.baseUrl}/sellers`, data);
  // }

  sellerSignup(data: signUp) {
    this.http
      .post(`${enviroment.baseUrl}/sellers`, data, { observe: 'response' })
      .subscribe(
        (res: any) => {
          this.isSellerLoggedIn.next(true);
          localStorage.setItem('seller_details', JSON.stringify(res.body));
          this.router.navigate(['seller-home']);
        },
        (err: any) => {
          console.log('User failed to save', err);
        }
      );
  }

  sellerLogin(data: logIn) {
    this.http
      .get(
        `${enviroment.baseUrl}/sellers?email=${data.email}&password=${data.password}`,
        { observe: 'response' }
      )
      .subscribe(
        (res: any) => {
          if(res && res.body && res.body?.length){
            localStorage.setItem('seller_details', JSON.stringify(res.body));
            this.router.navigate(['home']);
          } else {
            console.log('User failed to login');
            this.isLoggedinError.emit(true);
          }
        },
        (err: any) => {
          console.log('User failed to login', err);
        }
      );
  }

  reloadSeller() {
    //if seller is registered & loggedin then again it should not go to registration page until logout.
    if (isPlatformBrowser(this.platformId)) {
    if (localStorage.getItem('seller_details')) {
      this.isSellerLoggedIn.next(true);
      this.router.navigate(['seller-home']);
    }
  }
  }
}
