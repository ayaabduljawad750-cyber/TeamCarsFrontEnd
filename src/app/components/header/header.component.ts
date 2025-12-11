import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  menuItems = [
    "Inner And Outer spare Parts",
    "Spare Parts",
    "Engine Oil & Fluids",
    "Tires & Rims & Batteries",
    "Accessories",
    "Commercial Vehicles"
  ];

  toggleMenu = false;
  cartCount = 0;

  openMenu() {
    this.toggleMenu = !this.toggleMenu;
  }

  changeLang(){
    alert("Lang changed!");
  }
}
