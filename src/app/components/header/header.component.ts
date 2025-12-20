import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
 import { TranslateService } from '@ngx-translate/core';

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
    private cartService: CartService,
    private translate: TranslateService) {
      const savedLang = localStorage.getItem('lang') || 'en';
  translate.setDefaultLang(savedLang);
  translate.use(savedLang);
  document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
     }



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




changeLang(lang: any) {
  const selectElement = lang.target as HTMLSelectElement;
  const selectedLang = selectElement.value;
  localStorage.setItem('lang', selectedLang);
  this.translate.use(selectedLang);
  document.documentElement.dir = selectedLang === 'ar' ? 'rtl' : 'ltr';
}

  mobileMenuOpen = false;

toggleMobileMenu() {
  this.mobileMenuOpen = !this.mobileMenuOpen;
}

closeMobileMenu() {
  this.mobileMenuOpen = false;
}
}
