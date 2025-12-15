import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  name = '';
  email = '';
  address = '';
  phone = '';
  paymentMethod = 'cod';
  loading = false;
  errorMsg = '';

  constructor(private orderService: OrderService) {}

  submitOrder() {
    if (!this.name || !this.email || !this.address || !this.phone) return;

    this.loading = true;
    this.errorMsg = '';

    const orderData = {
      name: this.name,
      email: this.email,
      address: this.address,
      phone: this.phone,
      paymentMethod: this.paymentMethod
    };

    if (this.paymentMethod === 'cod') {
      // الدفع عند الاستلام
      this.orderService.createOrder('cod').subscribe({
        next: (res) => {
          this.loading = false;
          alert('Order placed successfully! Payment on delivery.');
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = err.error?.message || 'Something went wrong';
        }
      });
    } else {
      // الدفع عن طريق Stripe
      // هنا ممكن توجه المستخدم لصفحة checkout
      this.loading = false;
      alert('Redirect to Stripe checkout...');
    }
  }
}
