import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }




loadCart(): void {
  this.cartService.getCart().subscribe((items: CartItem[]) => {
    this.cart = items.map((item) => ({
      ...item,
      price: Number(item.price) || 0,
      // ✅ keep image object as-is
      image: item.image ? { 
        contentType: item.image.contentType, 
        data: item.image.data 
      } : undefined,
    }));
  });
}



  getImageSrc(item: CartItem): string | undefined {
  if (item.image) {
    return `data:${item.image.contentType};base64,${item.image.data}`;
  }
  return undefined;
}

increase(item: CartItem): void {
  const updatedItem = { ...item, quantity: item.quantity + 1 };
  this.cartService.updateCart(updatedItem).subscribe(() => {
    // update local cart immediately
    item.quantity++;
  });
}

decrease(item: CartItem): void {
  if (item.quantity > 1) {
    const updatedItem = { ...item, quantity: item.quantity - 1 };
    this.cartService.updateCart(updatedItem).subscribe(() => {
      item.quantity--;
    });
  } else {
    this.remove(item.productId);
  }
}

  remove(productId: string): void {
    this.cartService.updateCart({ productId, quantity: 0 })
      .subscribe(() => this.loadCart());
  }

  clear(): void {
    this.cartService.clearCart().subscribe(() => this.loadCart());
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
  }
}