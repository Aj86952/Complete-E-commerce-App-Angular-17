import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { cart, product, signUp } from '../../data-type';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.scss',
})
export class UserAuthComponent implements OnInit {
  public form_details: signUp = {
    name: '',
    email: '',
    password: '',
  };
  public isUserLoggedIn: boolean = false;
  public auth_error: string = '';

  constructor(private userService: UserService, private productService: ProductService) {}

  ngOnInit() {
    this.userService.userAuthReload();
  }

  userSignUp() {
    if (
      this.form_details.name === '' ||
      this.form_details.email === '' ||
      this.form_details.password === ''
    ) {
      alert('Please enter all details');
    } else {
      this.userService.userSignup(this.form_details);
      this.form_details.name = '';
      this.form_details.email = '';
      this.form_details.password = '';
    }
  }

  userLogIn() {
    this.auth_error = '';
    this.userService.userLogin(this.form_details);
    this.userService.isUserLoggedinError.subscribe((isError: any) => {
      if (isError) {
        this.auth_error = 'Invalid Email or Password';
      } else {
        // this.localCartToRemoteCart();
      }
    });
    setTimeout(() => {
      this.localCartToRemoteCart();
    }, 1000);
    this.form_details.email = '';
    this.form_details.password = '';
  }

  checkUserLogin() {
    this.isUserLoggedIn = this.isUserLoggedIn ? false : true;
    this.auth_error = '';
  }

  localCartToRemoteCart() {
    //To store cart_data in localstorage into DB through API call
    let userData: any = localStorage.getItem('user_details');
    let userId = JSON.parse(userData)[0].id;
    if (localStorage.getItem('local_cart')) {
      let cartData: any = localStorage.getItem('local_cart');
      let cartDetails: cart[] = JSON.parse(cartData);
      cartDetails.forEach((element, index) => {
        let param = {
          ...element,
          productId: element.id,
          userId,
        };
        delete param.id;
        setTimeout(() => {
          this.productService.addDataToCart(param).then((res:any) => {
            if(res){
            //  alert("Product successfully added to cart..!")
            console.log("Product successfully added to cart..!");
            }
           }).catch((err:any) => {
             console.log("Product failed to add in cart", err);
           })
        }, 500);
         if(cartDetails.length == index+1){
            localStorage.removeItem("local_cart")
         }
      });
    }

    setTimeout(() => {
    //To get cart_data added by specific user who is loggedin
      this.productService.getCartList(userId);
    }, 500);
  }

}
