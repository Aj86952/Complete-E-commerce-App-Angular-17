import { CanActivateFn } from '@angular/router';
import { SellerService } from '../services/seller.service';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
const sellerService = inject(SellerService);
const platformId = inject(PLATFORM_ID);

  // return true;
  // if(localStorage.getItem("seller_details")){
  //   return true;
  // }

  if (isPlatformBrowser(platformId)) {
    if (localStorage.getItem('seller_details')) {
      return true;
    }
  }
  return sellerService.isSellerLoggedIn;
};
