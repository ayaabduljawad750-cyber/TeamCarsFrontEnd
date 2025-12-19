import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit, OnDestroy {
  currentView: 'users' | 'orders' | 'profiles' | 'centers' = 'users';
  users: any[] = [];
  orders: any[] = [];
  centers: any[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private maintenanceService: MaintenanceService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // USERS
roleFilter: string = '';
searchTerm: string = '';

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
    this.authService.deleteUserByAdmin(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleSuccess('User deleted'),
        error: (err: any) => this.handleError(err)
      });
  }

  // ORDERS
  loadOrders() {
    this.isLoading = true;
    this.orderService.getAllOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => { this.orders = res.data || res; this.isLoading = false; },
        error: (err: any) => {
          console.log("error",err)
          this.handleError(err)}
      });
  }

  updateOrderStatus(id: string, status: string) {
    this.orderService.updateOrderStatus(id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleSuccess('Order status updated'),
        error: (err: any) => this.handleError(err)
      });
  }

  deleteOrder(id: string) {
    this.orderService.deleteOrder(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleSuccess('Order deleted'),
        error: (err: any) => this.handleError(err)
      });
  }

  // MAINTENANCE CENTERS
  loadCenters() {
    this.isLoading = true;
    this.maintenanceService.getCenters()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.centers = Array.isArray(res.data.centers) ? res.data.centers : [res.data.centers];
          this.isLoading = false;
        },
        error: (err: any) => this.handleError(err)
      });
  }

  deleteCenter(id: string) {
    this.maintenanceService.deleteCenter(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleSuccess('Center deleted'),
        error: (err: any) => this.handleError(err)
      });
  }

  // Helpers
  private handleSuccess(msg: string) {
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 3000);
    if (this.currentView === 'users') this.loadUsers();
    if (this.currentView === 'orders') this.loadOrders();
    if (this.currentView === 'centers') this.loadCenters();
    this.isLoading = false;
  }

  private handleError(err: any) {
    this.errorMessage = err.error?.message || 'Operation failed';
    setTimeout(() => this.errorMessage = '', 3000);
    this.isLoading = false;
  }
}