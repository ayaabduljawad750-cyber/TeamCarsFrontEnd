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
export class CartComponent implements OnInit, OnDestroy {
  cart: CartItem[] = [];
  private cartSubscription!: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // الاشتراك في التحديثات من خدمة الكارت
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
    
    // جلب الكارت الحالي
    this.cart = this.cartService.getMyCart();
  }

  increase(item: CartItem) {
    // تصحيح: استدعاء الدالة الصحيحة من الخدمة
    this.cartService.increaseQty(item._id);
  }

  decrease(item: CartItem) {
    // تصحيح: استدعاء الدالة الصحيحة من الخدمة
    this.cartService.decreaseQty(item._id);
  }

  remove(id: string) {
    // تصحيح: استخدام دالة removeItem من الخدمة
    this.cartService.removeItem(id);
  }

  getTotal(): number {
    return this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  ngOnDestroy(): void {
    // تنظيف الاشتراك لمنع تسرب الذاكرة
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  // دالة إضافية لحساب عدد المنتجات
  getItemCount(): number {
    return this.cart.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }
}