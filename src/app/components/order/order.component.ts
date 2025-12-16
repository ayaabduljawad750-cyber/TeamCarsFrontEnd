import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CartService, CartItem } from '../../services/cart.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  name = '';
  email = '';
  address = '';
  phone = '';
  paymentMethod = 'cod';
  loading = false;
  errorMsg = '';

  cartItems: CartItem[] = [];

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.cartService.getCart().subscribe(items => this.cartItems = items);
  }

  submitOrder() {
    if (!this.name || !this.email || !this.address || !this.phone) {
      this.errorMsg = 'Please fill all fields!';
      return;
    }

    if (this.cartItems.length === 0) {
      this.errorMsg = 'Cart is empty!';
      return;
    }
   console.log(this.cartItems);
    this.loading = true;
    this.errorMsg = '';

    const orderData = {
      name: this.name,
      email: this.email,
      address: this.address,
      phone: this.phone,
      paymentMethod: this.paymentMethod
    };

    if (this.paymentMethod === 'cash') {
      this.orderService.createOrder(this.cartItems, orderData).subscribe({
        next: (res) => {
          this.loading = false;
          alert('Order placed successfully! Payment on delivery.');
          this.cartService.clearCart().subscribe(); // تفريغ الكارت بعد الطلب
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = err.error?.message || 'Something went wrong';
        }
      });
    } else {
   
      this.loading = false;
      alert('Redirect to Stripe checkout...');
    
       this.router.navigate(['checkout']);
    }
  }
}
