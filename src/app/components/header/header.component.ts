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
  cartCount = 0;
  FirstChar = '';
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
  ) { }

  ngOnInit() {
    if(this.auth.isLogin()){
  // user info
  this.auth.currentUser$.subscribe(user => {
    if (user) {
      this.FirstChar = user.firstName[0];
      // ✅ if logged in, load cart to initialize count
      this.cartService.getCart().subscribe();
    }
  });
  this.auth.getCurrentUser().subscribe();

  // ✅ listen to cart count
  this.cartService.cartCount$.subscribe(count => {
    this.cartCount = count;
  });

    }
  
  }

  isLogin() {
    return this.auth.isLogin();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
    this.cartCount = 0
  }

  openMenu() {
    this.toggleMenu = !this.toggleMenu;
  }

  changeLang() {
    alert('Language changed');
  }
}