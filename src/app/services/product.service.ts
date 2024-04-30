import { enviroment } from './../enviroment';
import { EventEmitter, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cart, order, product } from '../data-type';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { log } from 'console';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public cartData = new EventEmitter<product[] | []>();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  saveProducts(data: product): Promise<any> {
    return this.http.post(`${enviroment.baseUrl}/products`, data).toPromise();
  }

  getProducts(): Promise<any> {
    return this.http
      .get<product[]>(`${enviroment.baseUrl}/products`)
      .toPromise();
  }

  deleteProduct(id: any): Promise<any> {
    return this.http.delete(`${enviroment.baseUrl}/products/${id}`).toPromise();
  }

  getProductById(id: any): Promise<any> {
    return this.http
      .get<product[]>(`${enviroment.baseUrl}/products/${id}`)
      .toPromise();
  }

  updateProduct(id: any, data: product): Promise<any> {
    return this.http
      .put<product[]>(`${enviroment.baseUrl}/products/${id}`, data)
      .toPromise();
  }

  popularProducts(): Promise<any> {
    return this.http
      .get<product[]>(`${enviroment.baseUrl}/products?_limit=3`)
      .toPromise();
  }

  trendyProducts(): Promise<any> {
    return this.http
      .get<product[]>(`${enviroment.baseUrl}/products?_limit=8`)
      .toPromise();
  }

  searchProducts(query: any): Promise<any> {
    return this.http
      .get<product[]>(`${enviroment.baseUrl}/products?q=${query}`)
      .toPromise();
  }

  addToCartLocal(data: product) {
    if (isPlatformBrowser(this.platformId)) {
      let cartData: any = [];
      let localCart = localStorage.getItem('local_cart');
      if (!localCart) {
        localStorage.setItem('local_cart', JSON.stringify([data]));
        this.cartData.emit([data]);
      } else {
        cartData = JSON.parse(localCart);
        cartData.push(data);
        localStorage.setItem('local_cart', JSON.stringify(cartData));
        this.cartData.emit(cartData);
      }
    }
  }

  removeFromCartLocal(productId: any) {
    let localCart = localStorage.getItem('local_cart');
    if (localCart) {
      let cartItems: product[] = JSON.parse(localCart);
      cartItems = cartItems.filter(
        (item: any) => item.id != productId.toString()
      );
      localStorage.setItem('local_cart', JSON.stringify(cartItems));
      this.cartData.emit(cartItems);
    }
  }

  addDataToCart(data: cart): Promise<any> {
    return this.http.post(`${enviroment.baseUrl}/cart`, data).toPromise();
  }

  getCartList(userId: any) {
    return this.http
      .get<product[]>(`${enviroment.baseUrl}/cart?userId=${userId}`, {
        observe: 'response',
      })
      .subscribe((res: any) => {
        if (res && res.body) {
          this.cartData.emit(res.body);
        }
      });
  }

  deleteCartProduct(cartId: any): Promise<any> {
    return this.http.delete(`${enviroment.baseUrl}/cart/${cartId}`).toPromise();
  }

  storeOrder(data: order): Promise<any> {
    return this.http.post(`${enviroment.baseUrl}/order`, data).toPromise();
  }

  getOrderList(userId: any): Observable<any> {
    return this.http.get(`${enviroment.baseUrl}/order?userId=${userId}`);
  }

  deleteOrder(id: any): Observable<any> {
    return this.http.delete(`${enviroment.baseUrl}/order/${id}`);
  }

  deleteCartItems(cartId: any) {
    return new Promise((ressolve, reject) => {
      return this.http
        .delete(`${enviroment.baseUrl}/cart/${cartId}`, { observe: 'response' })
        .subscribe((res) => {
          if (res) {
            ressolve(this.cartData.emit([]));
          } else {
            reject('Error occrred while removing cart item');
          }
        });
    });
  }
}
