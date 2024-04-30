import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { cart, product } from '../../data-type';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  // public productDetails: undefined | product;
  public productDetails: any = '';
  public qunatity: number = 1;
  public removeCart: boolean = false;
  // public currentCartProduct : undefined | product;
  public currentCartProduct : any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    const productId = this.activatedRoute.snapshot.paramMap.get('productId');
    this.getProductDetails(productId);
    this.toggleAddRemoveCartButton(productId);
    this.mantainState(productId);
  }

  mantainState(productId: any) {
    //After adding new item in cart, cart_count and toggle_button was working due to 
    // (To refresh cart_count and toggle to remove button - line 110) but after refreshing page previous state was not mantaining
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user_details');
      if (user) {
        const userId = JSON.parse(user)[0].id;
        this.productService.getCartList(userId);
        this.productService.cartData.subscribe((result: any) => {
          let item = result.filter((element: any) => {
            return productId == element.productId
          });
          console.log("mantainState item", item);
          if (item?.length) {
            this.removeCart = true;
            this.currentCartProduct = item[0];
          }
        });
      }
    }
  }

  toggleAddRemoveCartButton(productId: any) {
    if (isPlatformBrowser(this.platformId)) {
      let cartData: any = localStorage.getItem('local_cart');
      if (productId && cartData) {
        let cartItems = JSON.parse(cartData);
        // cartItems = cartItems.filter((item: any) => {
        //   item.id == productId;
        // });
        cartItems = cartItems.filter((item: any) => item.id == productId );
        if (cartItems?.length) {
          this.removeCart = true;
        } else {
          this.removeCart = false;
        }
      }
    }
  }

  getProductDetails(id: any) {
    this.productService
      .getProductById(id)
      .then((res: any) => {
        if (res) {
          this.productDetails = res;
        }
      })
      .catch((err: any) => {
        console.log('Failed to get product details', err);
      });
  }

  handleQuantity(val: any) {
    if (this.qunatity < 20 && val === 'plus') {
      this.qunatity += 1;
    } else if (this.qunatity > 1 && val === 'minus') {
      this.qunatity -= 1;
    }
  }

  addToCart() {
    //If user is not loggedin then need to handle cart functionality with local storage else API.
    if (isPlatformBrowser(this.platformId)) {
      if (this.productDetails) {
        this.productDetails.qunatity = this.qunatity;
        if (!localStorage.getItem('user_details')) {
          this.productService.addToCartLocal(this.productDetails);
          this.removeCart = true;
        } else {
          const user: any = localStorage.getItem('user_details');
          const userData = JSON.parse(user)[0];
          let param: cart = {
            userId: userData.id,
            productId: this.productDetails.id,
            ...this.productDetails,
          };
          delete param.id;
          this.productService
            .addDataToCart(param)
            .then((res: any) => {
              if (res) {
                //To refresh cart_count and toggle to remove button
                this.productService.getCartList(userData.id);
                this.removeCart = true;
                alert('Product successfully added to cart..!');
              }
            })
            .catch((err: any) => {
              console.log('Product failed to add in cart', err);
            });
        }
      }
    }
  }

  removeFromCart(id: any) {
    //If user is not loggedin then need to handle cart functionality with local storage else API.
    if (!localStorage.getItem('user_details')) {
    this.productService.removeFromCartLocal(id);
    }else{
      this.currentCartProduct && this.productService.deleteCartProduct(this.currentCartProduct.id).then((res:any) => {
        if(res){
          alert("Product is succeesfully removed form cart");
          const user = localStorage.getItem('user_details');
          // if (user) {
            const userId = user && JSON.parse(user)[0].id;
            this.productService.getCartList(userId);
          // }
        }
     }).catch((err:any) => {
      console.log("Product is failed to remov form cart", err);
     })
    }
    this.removeCart = false;
  }
}
