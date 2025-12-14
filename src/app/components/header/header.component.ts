import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

 cartCount: number = 0;
  FirstChar: string = '';

  // ✅ إضافات
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
    private cartService: CartService
  ) {}

  ngOnInit() {

    // user
    this.auth.currentUser$.subscribe(user => {
      if (user) {
        this.FirstChar = user.firstName[0];
      } 
    });

    // cart count
   this.cartService.cart$.subscribe((cartItems: any[]) => {
  this.cartCount = cartItems.length;
});

  }

  isLogin() {
    return this.auth.isLogin();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
    this.cartCount = 0;
  }

  // ✅ إضافات
  openMenu() {
    this.toggleMenu = !this.toggleMenu;
  }

  changeLang() {
    alert('Language changed');
  }
}
