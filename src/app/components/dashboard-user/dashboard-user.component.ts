import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { BackendValidators } from 'src/app/validators/backend.validators';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.css']
})
export class DashboardUserComponent implements OnInit, OnDestroy {
  // Forms with ! (definite assignment assertion) to satisfy strict mode
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  
  // UI State
  isLoading = false;
  showPasswordSection = false;
  successMessage = '';
  errorMessage = '';

  // Password Visibility Flags (Restored for your HTML)
  hideOld = true;
  hideNew = true;
  hideConfirm = true;

  // Cleanup Subject
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForms() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, BackendValidators.nameValidator()]], 
      lastName: ['', [Validators.required, BackendValidators.nameValidator()]],
      email: [{ value: '', disabled: true }]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, BackendValidators.strongPasswordValidator()]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  loadUserData() {
    this.isLoading = true;
    this.authService.getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const user = res?.data?.user || res;
          if (user) {
            this.profileForm.patchValue({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email
            });
          }
          this.isLoading = false;
        },
        error: () => this.handleFeedback('error', 'Failed to load user data.')
      });
  }

  onSaveProfile() {
    if (this.profileForm.invalid) return;

    this.isLoading = true;
    this.authService.updateUser(this.profileForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleFeedback('success', 'Profile updated successfully!'),
        error: () => this.handleFeedback('error', 'Failed to update profile.')
      });
  }

  onChangePassword() {
    if (this.passwordForm.invalid) return;

    this.isLoading = true;
    this.authService.updateMyPassword(this.passwordForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.handleFeedback('success', 'Password changed successfully!');
          this.togglePasswordSection(); 
        },
        error: (err) => this.handleFeedback('error', err.error?.message || 'Incorrect old password.')
      });
  }

  togglePasswordSection() {
    this.showPasswordSection = !this.showPasswordSection;
    if (!this.showPasswordSection) {
      this.passwordForm.reset();
      // Reset visibility to hidden when closing
      this.hideOld = true;
      this.hideNew = true;
      this.hideConfirm = true;
    }
  }

  private passwordMatchValidator(control: AbstractControl) {
    const newPass = control.get('newPassword')?.value;
    const confirmPass = control.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  private handleFeedback(type: 'success' | 'error', msg: string) {
    this.isLoading = false;
    if (type === 'success') {
      this.successMessage = msg;
      this.errorMessage = '';
    } else {
      this.errorMessage = msg;
      this.successMessage = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Clear message after 3 seconds
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }
}