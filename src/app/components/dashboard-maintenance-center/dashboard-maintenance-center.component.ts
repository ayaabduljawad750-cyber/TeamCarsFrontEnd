import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaintenanceService, MaintenanceCenter, Booking } from 'src/app/services/maintenance.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard-maintenance-center',
  templateUrl: './dashboard-maintenance-center.component.html',
  styleUrls: ['./dashboard-maintenance-center.component.css']
})
export class DashboardMaintenanceCenterComponent implements OnInit, OnDestroy {
  // Views: Requests (Bookings), Center (Business Info), Profile (Personal User Info)
  currentView: 'requests' | 'center' | 'profile' = 'requests'; 
  
  isLoading = false;
  hasCenterProfile = false;
  currentCenter: MaintenanceCenter | null = null;
  bookings: Booking[] = [];
  
  centerForm!: FormGroup;
  successMessage = '';
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private maintenanceService: MaintenanceService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.checkProfileStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm() {
    this.centerForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      
      // VALIDATION: Required + Exactly 11 digits
      phone: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]{11}$/) 
      ]],
      
      // VALIDATION: Required + Valid Email Format
      email: ['', [
        Validators.required, 
        Validators.email 
      ]],
      
      services: [''], 
      workingHours: [''] 
    });
  }

  checkProfileStatus() {
    this.isLoading = true;
    this.maintenanceService.getMyCenter()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res.data && res.data.center) {
            this.hasCenterProfile = true;
            this.currentCenter = res.data.center;
            this.populateForm(this.currentCenter!);
            this.loadBookings();
            this.currentView = 'requests'; 
          } else {
            this.hasCenterProfile = false;
            // Force user to Center Details view to create one
            this.currentView = 'center'; 
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
        }
      });
  }

  populateForm(center: MaintenanceCenter) {
    this.centerForm.patchValue({
      name: center.name,
      location: center.location,
      phone: center.phone,
      email: center.email,
      services: Array.isArray(center.services) ? center.services.join(', ') : center.services,
      workingHours: Array.isArray(center.workingHours) ? center.workingHours.join(', ') : center.workingHours
    });
  }

  loadBookings() {
    this.maintenanceService.getMyBookings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.bookings = res.data || [];
        },
        error: () => console.error("Failed to load bookings")
      });
  }

  onSubmitCenter() {
    if (this.centerForm.invalid) {
      this.centerForm.markAllAsTouched(); // Trigger validation messages
      return;
    }

    this.isLoading = true;
    const formVal = this.centerForm.value;
    
    // Convert comma-separated strings to arrays
    const payload: MaintenanceCenter = {
      ...formVal,
      services: typeof formVal.services === 'string' ? formVal.services.split(',').map((s: string) => s.trim()) : formVal.services,
      workingHours: typeof formVal.workingHours === 'string' ? formVal.workingHours.split(',').map((s: string) => s.trim()) : formVal.workingHours
    };

    if (this.hasCenterProfile && this.currentCenter?._id) {
      // UPDATE
      this.maintenanceService.updateCenter(this.currentCenter._id, payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showFeedback('Center Details Updated Successfully');
            this.isLoading = false;
          },
          error: (err) => this.handleError(err)
        });
    } else {
      // CREATE
      this.maintenanceService.createCenter(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.hasCenterProfile = true;
            this.currentCenter = res.data || res;
            this.showFeedback('Maintenance Center Created!');
            this.loadBookings();
            this.currentView = 'requests'; 
            this.isLoading = false;
          },
          error: (err) => this.handleError(err)
        });
    }
  }

  updateStatus(bookingId: string, status: 'Accepted' | 'Rejected') {
    if (!confirm(`Mark this request as ${status}?`)) return;
    
    this.isLoading = true;
    this.maintenanceService.updateBookingStatus(bookingId, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showFeedback(`Booking ${status}`);
          this.loadBookings();
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Status update failed';
          this.isLoading = false;
        }
      });
  }

  private showFeedback(msg: string) {
    this.successMessage = msg;
    this.errorMessage = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => this.successMessage = '', 3000);
  }

  private handleError(err: any) {
    this.errorMessage = err.error?.message || 'Operation failed';
    this.isLoading = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}