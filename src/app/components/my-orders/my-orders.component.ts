import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { order } from '../../data-type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss',
})
export class MyOrdersComponent implements OnInit {
  public orderList: order[] | undefined;
  public cancelOrderMsg: any = "";

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getUserOrderList();
  }

  getUserOrderList() {
    const userStore = localStorage.getItem('user_details');
    const userData = userStore && JSON.parse(userStore)[0];
    this.productService.getOrderList(userData.id).subscribe(
      (res: any) => {
        if (res?.length) {
          this.orderList = res;
        }
      },
      (err: any) => {
        console.log('Failed to get order list', err);
      }
    );
  }

  cancelOrder(id: any) {
    const retVal = confirm('Are you sure, you want to Cancel order?');
    if (retVal === true) {
      this.productService.deleteOrder(id).subscribe(
        (res: any) => {
          this.getUserOrderList();
          if (res) {
            this.cancelOrderMsg = "Your order is canceled."
          }
          setTimeout(() => {
            this.cancelOrderMsg = "";
          }, 3000);
        },
        (err: any) => {
          console.log('Failed to cancel order', err);
        }
      );
    } else {
      return;
    }
  }
}
