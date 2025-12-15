import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

cartCount = 0;
  isAuthenticated = false;
  isLoading = false;
  
  // private cartSubscription!: Subscription;
  // private authSubscription!: Subscription;
  // private loadingSubscription!: Subscription;
  FirstChar= '';

  toggleMenu = false;

  menuItems = [
    "Spare Parts",
    "Engine Oil",
    "Tires",
    "Batteries",
    "Liquids"
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
   // private cartService: CartService
  ) {}

  ngOnInit() {

    // user
    this.auth.currentUser$.subscribe(user => {
      console.log(user);
      if (user) {
        this.FirstChar = user.firstName[0];
      } 
    });
this.auth.getCurrentUser().subscribe();
    // cart count
    //   this.cartSubscription = this.cartService.cart$.subscribe(cart => {
    //   this.cartCount = this.cartService.getItemCount() ;
    // });

    

    // // الاشتراك في حالة التحميل
    // this.loadingSubscription = this.cartService.isLoading$.subscribe(loading => {
    //   this.isLoading = loading;
    // });

    

//    this.cartService.cart$.subscribe((cartItems: any[]) => {
//   this.cartCount = cartItems.length;
// });

  }

  isLogin() {
    return this.auth.isLogin();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
    // this.cartCount = 0;
  }

  openMenu() {
    this.toggleMenu = !this.toggleMenu;
  }

  changeLang() {
    alert('Language changed');
  }
}
