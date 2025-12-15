import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock?: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent /*implements OnInit, OnDestroy */{
  // cart: CartItem[] = [];
  // private cartSubscription!: Subscription;

  // constructor(private cartService: CartService) {}

  // ngOnInit(): void {

  //   this.cartSubscription = this.cartService.cart$.subscribe(cart => {
  //     this.cart = cart;
  //   });
    

  //   this.cart = this.cartService.getMyCart();
  // }

  // increase(item: CartItem) {

  //   this.cartService.increaseQty(item._id);
  // }

  // decrease(item: CartItem) {

  //   this.cartService.decreaseQty(item._id);
  // }

  // remove(id: string) {
 
  //   this.cartService.removeItem(id);
  // }

  // getTotal(): number {
  //   return this.cart.reduce(
  //     (sum, item) => sum + item.price * item.quantity,
  //     0
  //   );
  // }

  // ngOnDestroy(): void {

  //   if (this.cartSubscription) {
  //     this.cartSubscription.unsubscribe();
  //   }
  // }


  // getItemCount(): number {
  //   return this.cart.reduce(
  //     (count, item) => count + item.quantity,
  //     0
  //   );
  // }
}