import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  menuItems = [
    "Spare Parts",
    "Engine Oil",
    "Tires",
    "Batteries",
    "Liquids"
  ];

  toggleMenu = false;
  cartCount = 0;

  openMenu() {
    this.toggleMenu = !this.toggleMenu;
  }

  changeLang() {
    alert("Lang changed!");
  }
}
