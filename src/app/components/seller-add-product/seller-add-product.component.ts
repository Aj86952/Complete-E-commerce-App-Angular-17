import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { product } from '../../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './seller-add-product.component.html',
  styleUrl: './seller-add-product.component.scss',
})
export class SellerAddProductComponent implements OnInit {
  public product_details: product = {
    name: '',
    price: 0,
    color: '',
    category: '',
    url: '',
  };
  public successMsg = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {}

  addProduct() {
    console.log('product_details', this.product_details);
    this.productService
      .saveProducts(this.product_details)
      .then((res: any) => {
        console.log('Product added successfully', res);
        if (res) {
          this.successMsg = 'Product added successfully';
          this.product_details.name = '';
          this.product_details.price = 0;
          this.product_details.color = '';
          this.product_details.category = '';
          this.product_details.url = '';
          setTimeout(() => { 
            this.successMsg = '';
            this.router.navigate(['seller-home']);
           }, 3000);
        }
      })
      .catch((err: any) => {
        console.log('Product failed to add', err);
      });
  }
}
