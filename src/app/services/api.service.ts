import { Injectable, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { logIn, signUp } from '../data-type';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { enviroment } from './../enviroment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedinError = new EventEmitter<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

}
