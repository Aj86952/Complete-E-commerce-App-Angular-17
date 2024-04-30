import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { product } from '../../data-type';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-seller-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './seller-home.component.html',
  styleUrl: './seller-home.component.scss'
})
export class SellerHomeComponent implements OnInit {
public productList:any = [];
// public productList:undefined | product[];
public deleteMsg = "";

constructor(private productService: ProductService){}

ngOnInit(): void {
  this.getProductsList();
}

getProductsList(){
  this.productService.getProducts().then((res:any) => {
    if(res.length){
      this.productList = res;
    }
  }).catch((err:any) => {
    console.log("Failed to fetch product list", err);
  })
}


removeProduct(id:any, index:any){
  // confirm("Are you sure, you want to delete?");
  this.productService.deleteProduct(id).then((res:any) => {
    if(res){
     this.deleteMsg = "Product is successfully deleted"
    //  this.getProductsList();
     this.productList?.splice(index, 1)
     setTimeout(() => {
      this.deleteMsg = "";
     }, 3000);
    }
  }).catch((err:any) => {
    console.log("Product failed to delete", err);
  })
}

}
