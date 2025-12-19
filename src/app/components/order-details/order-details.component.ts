import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  isLoading = false;
  errorMessage = '';
  orderId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
      this.loadOrderDetails();
    });
  }

  loadOrderDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (res) => {
        if (res.success) {
          this.order = res.data;
        } else {
          this.errorMessage = res.message || 'Order not found';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load order details';
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'paid': return 'status-paid';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-unknown';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'pending': return 'Pending';
      case 'paid': return 'Paid';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }

  getPaymentMethodText(method: string): string {
    switch(method) {
      case 'cash': return 'Cash on Delivery';
      case 'card': return 'Card Payment';
      default: return method;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }

  getProductImage(item: any): string {
    try {
        const bufferData = item.productId?.image.data.data;
        const binary = String.fromCharCode(...new Uint8Array(bufferData));
        return `data:${item.productId?.image.contentType};base64,${window.btoa(binary)}`;
      } catch (e) {
        return 'assets/placeholder.png';
      }
  }

  cancelOrder(): void {
    if (!this.order) return;
    
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelMyOrder(this.order._id).subscribe({
        next: (res) => {
          if (res.success) {
            alert('Order cancelled successfully!');
            this.loadOrderDetails(); // Refresh order details
          } else {
            alert(res.message || 'Failed to cancel order');
          }
        },
        error: (err) => {
          alert(err.error?.message || 'Failed to cancel order');
        }
      });
    }
  }

  canCancel(): boolean {
    return this.order?.status === 'pending';
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  printOrder(): void {
    window.print();
  }
}