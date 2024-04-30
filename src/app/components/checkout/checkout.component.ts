import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { cart, order } from '../../data-type';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  public totalAmount: number = 0;
  public userId: any;
  public allCartData: cart[] | undefined;

  constructor(
    private productService: ProductService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.getTotalAmount();
  }

  getTotalAmount() {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user_details');
      this.userId = user && JSON.parse(user)[0].id;
      this.productService.getCartList(this.userId);
      this.productService.cartData.subscribe((result: any) => {
        if (result?.length) {
          this.allCartData = result;
          let currentPrice = 0;
          result.forEach((element: any) => {
            //added + initially to convert string into number
            currentPrice = currentPrice + +element.price * +element.qunatity;
          });
          this.totalAmount =
            currentPrice + currentPrice / 10 + currentPrice / 10 + 20;
        }
      });
    }
  }

  async checkout(data: order) {
    debugger;
    let param = {
      ...data,
      totalPrice: this.totalAmount,
      userId: this.userId,
    };

    //To remove cart_list after checkout
    this.allCartData?.forEach(async (element) => {
      await this.productService.deleteCartItems(element.id);
    });

    await this.productService.storeOrder(param).then(
      (res: any) => {
        if (res) {
          alert('Order is successfully placed..!');
          setTimeout(() => {
            this.router.navigate(['/my-orders']);
          }, 4000);
        }
      },
      (err: any) => {
        console.log('Failed to store order', err);
      }
    );
  }
}
