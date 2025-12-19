import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  statusFilter = 'all';
  
  // Status options
  statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        if (res.success) {
          this.orders = res.data;
          this.filterOrders();
        } else {
          this.errorMessage = res.message || 'Failed to load orders';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load orders';
        this.isLoading = false;
      }
    });
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      // Filter by status
      if (this.statusFilter !== 'all' && order.status !== this.statusFilter) {
        return false;
      }
      
      // Filter by search term (order ID)
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        return order._id.toLowerCase().includes(searchLower);
      }
      
      return true;
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
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }

  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/orders', orderId]);
  }

  cancelOrder(orderId: string): void {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    this.orderService.cancelMyOrder(orderId).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Order cancelled successfully!');
          this.loadOrders(); // Refresh the list
        } else {
          alert(res.message || 'Failed to cancel order');
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to cancel order');
      }
    });
  }

  canCancel(order: Order): boolean {
    // Users can only cancel pending orders
    return order.status === 'pending';
  }

  getOrderItemsCount(order: Order): number {
    return order.items?.length || 0;
  }

  getOrderItemsSummary(order: Order): string {
    if (!order.items || order.items.length === 0) return 'No items';
    
    const count = order.items.length;
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    
    if (count === 1) {
      return `${totalItems} item`;
    }
    return `${count} products (${totalItems} items)`;
  }
}