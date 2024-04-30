import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { product } from '../../data-type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './search-list.component.html',
  styleUrl: './search-list.component.scss',
})
export class SearchListComponent implements OnInit {
  // public searchList: undefined | product[];
  public searchList: any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const searchParam = this.activatedRoute.snapshot.paramMap.get('query');
    this.getSearchedList(searchParam);
  }

  getSearchedList(query: any) {
    //To check query(data) is present or not
    query && this.productService
        .searchProducts(query)
        .then((res: any) => {
          if (res?.length) {
            this.searchList = res;
          }
        })
        .catch((err: any) => {
          console.log('Failed to get search products', err);
        });
  }
}
