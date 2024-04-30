import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { product } from '../../data-type';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-seller-update-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './seller-update-product.component.html',
  styleUrl: './seller-update-product.component.scss',
})
export class SellerUpdateProductComponent implements OnInit {
  public product_details: product = {
    name: '',
    price: 0,
    color: '',
    category: '',
    url: '',
  };
  public updateMsg = '';
  public prod_id:any = '';

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.prod_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getProductDetails(this.prod_id);
  }

  getProductDetails(id: any) {
    this.productService
      .getProductById(id)
      .then((res: any) => {
        if (res) {
          this.setProductDetails(res);
        }
      })
      .catch((err: any) => {
        console.log('Failed to get product details', err);
      });
  }

  setProductDetails(data: any) {
    this.product_details.name = data.name;
    this.product_details.price = data.price;
    this.product_details.color = data.color;
    this.product_details.category = data.category;
    this.product_details.url = data.url;
  }

  updateProduct() {
    this.productService.updateProduct(this.prod_id, this.product_details).then((res) => {
      console.log('updateProduct res', res);
      if(res){
        this.updateMsg = "Product updated successfully"
        setTimeout(() => {
          this.updateMsg = "";
          this.router.navigate(['/seller-home'])
        }, 2000);
      }
    }).catch((err) => {
      console.log('Failed to update product details', err);
    })
  }

}
