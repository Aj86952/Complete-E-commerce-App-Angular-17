import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { product } from '../../data-type';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  public menuType: string = 'default';
  public sellerName: string = '';
  public userName: string = '';
  public cartItems: number = 0;
  // public cartItems: number | undefined ;
  // public isBrowser: any = isPlatformBrowser(this.platformId);
  // public serachResult: undefined | product[];
  public serachResult: any = [];
  public searchText: any = '';

  constructor(
    private router: Router,
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.getRoutes();
    this.getCartCount();

    // if (isPlatformBrowser(this.platformId)) {
    //   if (localStorage.getItem('seller_details')) {
    //     const sellerStore = localStorage.getItem('seller_details');
    //     const sellerData = sellerStore && JSON.parse(sellerStore)[0];
    //     this.sellerName = sellerData.name;
    //   } else if (localStorage.getItem('user_details')) {
    //     const userStore = localStorage.getItem('user_details');
    //     const userData = userStore && JSON.parse(userStore);
    //     this.userName = userData.name;
    //   }
    // }
    console.log('this.menuType ', this.menuType);
  }

  getCartCount(){
    if(isPlatformBrowser(this.platformId)){
      if(localStorage.getItem("local_cart")){
        let cartData:any = localStorage.getItem("local_cart");      
        this.cartItems = JSON.parse(cartData).length;
      }
    }
    //newly added product count will not reflect simultaneouly until we refresh page, so added below condition
    this.productService.cartData.subscribe((res:any) => {          
      this.cartItems = res.length;
    })
  }

  getRoutes() {
    this.router.events.subscribe(
      (res: any) => {
        if (res.url && isPlatformBrowser(this.platformId)) {
          if (
            localStorage.getItem('seller_details') &&
            res.url.includes('seller')
          ) {
            this.menuType = 'seller';
            const sellerStore = localStorage.getItem('seller_details');
            const sellerData = sellerStore && JSON.parse(sellerStore)[0];
            this.sellerName = sellerData.name;
          } else if (localStorage.getItem('user_details')) {
            this.menuType = 'user';
            const userStore = localStorage.getItem('user_details');
            const userData = userStore && JSON.parse(userStore);
            console.log("userData", userData);
            
            this.userName = userData.name;
            // this.productService.getCartList(userData.id); //not working
          } else {
            this.menuType = 'default';
          }
        }
      },
      (err: any) => {
        console.log('Failled to subscribe router', err);
      }
    );
  }

  getSearchedProducts(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      this.productService
        .searchProducts(element.value)
        .then((res: any) => {
          if (res?.length > 3) {
            res.length = 3;
            this.serachResult = res;
          } else {
            this.serachResult = res;
          }
        })
        .catch((err: any) => {
          console.log('Failed to get search products', err);
        });
    }
  }

  hideSearchResults() {
    this.serachResult = undefined;
  }

  searchList(data: any) {
    this.router.navigate(['/search-list', data]);
  }

  goToDetailsPage(id: any) {
    this.router.navigate(['/product-details/' + id]);
  }

  logout() {
    localStorage.removeItem('seller_details');
    this.router.navigate(['/']);
  }

  userLogout() {
    localStorage.removeItem('user_details');
    this.router.navigate(['/user-auth']);
    this.productService.cartData.emit([]); //To make count 0 after logout
  }
}
