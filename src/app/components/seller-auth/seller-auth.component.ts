import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SellerService } from '../../services/seller.service';
import { Router } from '@angular/router';
import { signUp } from '../../data-type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './seller-auth.component.html',
  styleUrl: './seller-auth.component.scss',
})
export class SellerAuthComponent implements OnInit {
  public form_details: signUp = {
    name: '',
    email: '',
    password: '',
  };
  public isLoggedIn: boolean = false;
  public auth_error: string = '';

  constructor(private sellerService: SellerService, private router: Router) {}

  ngOnInit(): void {
    // this.sellerService.reloadSeller();
  }

  signUp() {
    // this.sellerService.sellerSignup(this.form_details);
    // this.form_details.name = "";
    // this.form_details.email = "";
    // this.form_details.password = "";

    if (
      this.form_details.name === '' ||
      this.form_details.email === '' ||
      this.form_details.password === ''
    ) {
      alert('Please enter all details');
    } else {
      this.sellerService.sellerSignup(this.form_details);
      this.form_details.name = '';
      this.form_details.email = '';
      this.form_details.password = '';
    }
  }

  logIn() {
    this.auth_error = '';
    this.sellerService.sellerLogin(this.form_details);
    this.sellerService.isLoggedinError.subscribe((isError: any) => {
      if (isError) {
        this.auth_error = 'Invalid Email or Password';
      }
    });
    this.form_details.email = '';
    this.form_details.password = '';
  }

  checkLogin() {
    this.isLoggedIn = this.isLoggedIn ? false : true;
    this.auth_error = '';
  }
}
