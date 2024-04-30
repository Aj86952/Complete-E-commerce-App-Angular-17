import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { cart } from '../../data-type';
import { priceSummary } from './../../data-type';
import { CommonModule } from '@angular/common';
import { RouterLink , Router} from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent {
  public cartList: cart[] | undefined;
  public priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0,
  };

  constructor(private productService: ProductService, private router : Router) {}

  ngOnInit() {
    this.getCurrentCartList();
  }

  getCurrentCartList() {
    const user = localStorage.getItem('user_details');
    if (user) {
      const userId = JSON.parse(user)[0].id;
      this.productService.getCartList(userId);
      this.productService.cartData.subscribe((result: any) => {        
        let currentPrice = 0;
        if (result?.length) {
          this.cartList = result;
          result.forEach((element: any) => {
            //added + initially to convert string into number
            currentPrice = currentPrice + (+element.price * +element.qunatity);
          });
          this.priceSummary.price = currentPrice;
          this.priceSummary.tax = currentPrice / 10;
          this.priceSummary.discount = currentPrice / 10;
          this.priceSummary.delivery = 40;
          this.priceSummary.total =
            currentPrice + currentPrice / 10 + currentPrice / 10 + 20;
        }else{
          this.router.navigate(['/']);
        }
      });
    }
  }

  removeCartItem(id:any){
    this.productService.deleteCartProduct(id).then((res:any) => {
      if(res){
        alert("Product is succeesfully removed form cart");
        this.getCurrentCartList();
      }
   }).catch((err:any) => {
    console.log("Product is failed to remov form cart", err);
   })
  }
}
