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
          this.cartService.clearCart().subscribe(); 
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
  loadCartPreview(): void {
    this.cartService.getCart().subscribe((items: CartItem[]) => {
      this.cartItems = items.map(item => ({
        ...item,
        price: Number(item.price) || 0,
        image: item.image ? { contentType: item.image.contentType, data: item.image.data } : undefined
      }));
    });
  }

  getImageSrc(item: CartItem): string | undefined {
    if (item.image) {
      return `data:${item.image.contentType};base64,${item.image.data}`;
    }
    return undefined;
  }
    getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
  }
  goBackToCart() {
  this.router.navigate(['/cart']);
}
}
