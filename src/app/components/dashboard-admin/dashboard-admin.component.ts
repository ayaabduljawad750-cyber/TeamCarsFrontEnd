import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService, Order } from 'src/app/services/order.service';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';



@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit, OnDestroy {
  currentView: 'users' | 'orders' | 'profiles' | 'centers' = 'users';
  users: any[] = [];
  orders: Order[] = [];
  centers: any[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  private destroy$ = new Subject<void>();

  // Filters
  roleFilter: string = '';
  searchTerm: string = '';
  orderStatusFilter: string = '';

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private maintenanceService: MaintenanceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // USERS
  loadUsers() {
    this.isLoading = true;
    const params: any = {};
    if (this.searchTerm) params.search = this.searchTerm;
    if (this.roleFilter) params.role = this.roleFilter;

    this.authService.getAllUsers(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.users = res.data?.users || [];
          this.isLoading = false;
        },
        error: (err: any) => this.handleError(err)
      });
  }

  updateUserName(id: string, firstName: string, lastName: string) {
    this.authService.updateUserByAdmin(id, { firstName, lastName })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleSuccess('User updated'),
        error: (err: any) => this.handleError(err)
      });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUserByAdmin(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.handleSuccess('User deleted');
            this.loadUsers();
          },
          error: (err: any) => this.handleError(err)
        });
    }
  }

  // ORDERS
  loadOrders() {
    this.isLoading = true;
    
    this.orderService.getAllOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => { 
          this.orders = res.data || []; 
          this.isLoading = false; 
        },
        error: (err: any) => {
          console.error("Error loading orders:", err);
          this.handleError(err);
        }
      });
  }

  // Update order status (admin action)
  updateOrderStatus(orderId: string, status: 'paid' | 'cancelled') {
    if (!orderId || !status) return;
    
    this.orderService.updateOrderStatus(orderId, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.handleSuccess(`Order marked as ${status}`);
            // Update local order status
            const orderIndex = this.orders.findIndex(o => o._id === orderId);
            if (orderIndex !== -1) {
              this.orders[orderIndex].status = status;
            }
          } else {
            this.handleError(res.message);
          }
        },
        error: (err: any) => this.handleError(err)
      });
  }

  // Delete order
  deleteOrder(id: string) {
    if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      this.orderService.deleteOrder(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.handleSuccess('Order deleted');
              // Remove from local orders array
              this.orders = this.orders.filter(order => order._id !== id);
            } else {
              this.handleError(res.message);
            }
          },
          error: (err: any) => this.handleError(err)
        });
    }
  }

  // User cancels order (different from admin cancelling)
  userCancelOrder(orderId: string) {
    if (!orderId) return;
    
    if (confirm('Are you sure you want to cancel this order? Stock will be restored if already paid.')) {
      this.orderService.cancelMyOrder(orderId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.handleSuccess('Order cancelled');
              // Update local order status
              const orderIndex = this.orders.findIndex(o => o._id === orderId);
              if (orderIndex !== -1) {
                this.orders[orderIndex].status = 'cancelled';
              }
            } else {
              this.handleError(res.message);
            }
          },
          error: (err: any) => this.handleError(err)
        });
    }
  }

  // Get user display name
  getUserDisplay(userId: any): string {
    if (!userId) return 'Unknown User';
    
    // If userId is a string (just the ID), we don't have user details
    if (typeof userId === 'string') {
      return `User ID: ${userId.substring(0, 8)}...`;
    }
    
    // If userId is a populated user object
    if (typeof userId === 'object') {
      if (userId.firstName || userId.lastName) {
        return `${userId.firstName || ''} ${userId.lastName || ''}`.trim();
      }
      if (userId.email) {
        return userId.email;
      }
      return 'User';
    }
    
    return 'Unknown User';
  }

  // Get user email
  getUserEmail(userId: any): string {
    if (!userId) return '';
    
    if (typeof userId === 'object' && userId.email) {
      return userId.email;
    }
    
    return '';
  }

  // Get status badge class
  getStatusClass(status: string): string {
    switch(status) {
      case 'paid': return 'status-paid';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-unknown';
    }
  }

  // Get status text
  getStatusText(status: string): string {
    switch(status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }

  // MAINTENANCE CENTERS
  loadCenters() {
    this.isLoading = true;
    this.maintenanceService.getCenters()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.centers = Array.isArray(res.data?.centers) ? res.data.centers : 
                        res.data?.center ? [res.data.center] : [];
          this.isLoading = false;
        },
        error: (err: any) => this.handleError(err)
      });
  }

  deleteCenter(id: string) {
    if (confirm('Are you sure you want to delete this maintenance center?')) {
      this.maintenanceService.deleteCenter(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.handleSuccess('Center deleted');
              // Remove from local centers array
              this.centers = this.centers.filter(center => center._id !== id);
            } else {
              this.handleError(res.message);
            }
          },
          error: (err: any) => this.handleError(err)
        });
    }
  }

  // Helpers
  private handleSuccess(msg: string) {
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 3000);
    this.isLoading = false;
  }

  private handleError(err: any) {
    this.errorMessage = err.error?.message || err.message || 'Operation failed';
    setTimeout(() => this.errorMessage = '', 3000);
    this.isLoading = false;
  }

  // View switching
  switchView(view: 'users' | 'orders' | 'profiles' | 'centers') {
    this.currentView = view;
    
    switch(view) {
      case 'users':
        this.loadUsers();
        break;
      case 'orders':
        this.loadOrders();
        break;
      case 'centers':
        this.loadCenters();
        break;
      case 'profiles':
        // Profile view doesn't need data loading
        break;
    }
  }

  // Format date
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

  // Calculate order items count
  getOrderItemsCount(order: Order): number {
    return order.items?.length || 0;
  }

  // Get order items summary
  getOrderItemsSummary(order: Order): string {
    if (!order.items || order.items.length === 0) return 'No items';
    
    const count = order.items.length;
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    
    if (count === 1) {
      return `${totalItems} item`;
    }
    return `${count} products (${totalItems} items)`;
  }

  // View order details
  viewOrderDetails(orderId: string) {
    this.router.navigate(['/orders', orderId]);
  }
}