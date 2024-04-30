import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { product } from '../../data-type';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  // public popularProductList: undefined | product[];
  public popularProductList: any = [];
  // public trendyProductList: undefined | product[];
  public trendyProductList: any = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.getPopularProducts();
    this.getTrendyProducts();
  }

  getPopularProducts() {
    this.productService
      .popularProducts()
      .then((res: any) => {
        if (res?.length) {
          this.popularProductList = res;
        }
      })
      .catch((err: any) => {
        console.log('Failed to get popular products', err);
      });
  }

  getTrendyProducts() {
    this.productService
      .trendyProducts()
      .then((res: any) => {
        if (res?.length) {
          this.trendyProductList = res;
        }
      })
      .catch((err: any) => {
        console.log('Failed to get trendy products', err);
      });
  }

}
