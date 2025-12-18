import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CartService, CartItem } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  @ViewChild('cardElement') cardElement!: ElementRef;

  stripe: any;
  elements: any;
  card: any;

  cartItems: CartItem[] = [];

  loading = false;
  errorMsg: string = '';

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router
  ) {}

  async ngOnInit() {
    // 🛒 load cart
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
    });

    // 💳 setup Stripe
    this.stripe = await this.orderService.getStripe();
    if (!this.stripe) {
      this.errorMsg = 'Stripe failed to load';
      return;
    }

    this.elements = this.stripe.elements();
    this.card = this.elements.create('card');
    this.card.mount(this.cardElement.nativeElement);
  }

  async payNow() {
    if (this.cartItems.length === 0) {
      this.errorMsg = 'Cart is empty!';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const orderData = {
      paymentMethod: 'stripe'
    };

    try {
      // 1️⃣ create order
      const res: any = await this.orderService
        .createOrder(this.cartItems, orderData)
        .toPromise();

      if (!res?.clientSecret) {
        throw new Error('Client secret not received');
      }

      // 2️⃣ confirm payment
      const result = await this.orderService.pay(
        res.clientSecret,
        this.card
      );

      if (result?.error) {
        throw new Error(result.error.message);
      }

      // 3️⃣ success
      alert('Payment Successful 🎉');
      this.cartService.clearCart().subscribe();
      this.router.navigate(['/']);

    } catch (err: any) {
      console.error(err);
      this.errorMsg = err.message || 'Payment failed';
    } finally {
      // ✅ always reset
      this.loading = false;
    }
  }
}
