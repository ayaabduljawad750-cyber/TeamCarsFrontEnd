import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private auth: AuthService,private router: Router) { }

  menuItems = [
    "Spare Parts",
    "Engine Oil",
    "Tires",
    "Batteries",
    "Liquids"
  ];

  toggleMenu = false;
  cartCount = 0;
  FirstChar=''
  isLogin(){
    return this.auth.isLogin()
  }
  logout(){
    this.auth.logout()
    this.router.navigate(['/']);
  }

  openMenu() {
    this.toggleMenu = !this.toggleMenu;
  }

  changeLang() {
    alert("Lang changed!");
  }

ngOnInit() {
  // 
  this.auth.currentUser$.subscribe(user => {
    console.log(user)
    if (user) {
      this.FirstChar = user.firstName[0];
      console.log("Updated FirstChar:", this.FirstChar);
    }
  });

  
  this.auth.getCurrentUser().subscribe();
}
}
