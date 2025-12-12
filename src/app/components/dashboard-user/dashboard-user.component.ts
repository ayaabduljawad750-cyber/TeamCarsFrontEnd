import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { BackendValidators } from 'src/app/validators/backend.validators';

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.css']
})
export class DashboardUserComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  
  showPasswordSection: boolean = false;
  isLoading: boolean = false;
  
  // Toggles for Password Visibility
  hideOld: boolean = true;
  hideNew: boolean = true;
  hideConfirm: boolean = true;

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    
    // --- Profile Form ---
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, BackendValidators.nameValidator()]], 
      lastName: ['', [Validators.required, BackendValidators.nameValidator()]],
      email: [{ value: '', disabled: true }]
    });

    // --- Password Form ---
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, BackendValidators.strongPasswordValidator()]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    this.isLoading = true;
    this.authService.getCurrentUser().subscribe({
      next: (user: any) => {
        const userData = user?.data?.user || user; 
        this.profileForm.patchValue({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email
        });
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onSaveProfile() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const { firstName, lastName } = this.profileForm.value;
      
      this.authService.updateUser({ firstName, lastName }).subscribe({
        next: () => {
          this.showSuccess('Profile updated successfully!');
          this.isLoading = false;
        },
        error: (err) => {
          this.showError('Failed to update profile.');
          this.isLoading = false;
        }
      });
    }
  }

  onChangePassword() {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      const { oldPassword, newPassword } = this.passwordForm.value;

      this.authService.updateMyPassword({ oldPassword, newPassword }).subscribe({
        next: () => {
          this.showSuccess('Password changed successfully!');
          this.passwordForm.reset();
          this.showPasswordSection = false;
          this.isLoading = false;
        },
        error: (err) => {
          this.showError(err.error?.message || 'Incorrect old password.');
          this.isLoading = false;
        }
      });
    }
  }

  togglePasswordSection() {
    this.showPasswordSection = !this.showPasswordSection;
    if (!this.showPasswordSection) this.passwordForm.reset();
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPass = control.get('newPassword')?.value;
    const confirmPass = control.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  // --- UPDATED HELPER METHODS ---

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private showSuccess(msg: string) {
    this.errorMessage = ''; // Clear error if success exists
    this.successMessage = msg;
    this.scrollToTop(); // Scroll up
    setTimeout(() => this.successMessage = '', 3000);
  }

  private showError(msg: string) {
    this.successMessage = ''; // Clear success if error exists
    this.errorMessage = msg;
    this.scrollToTop(); // Scroll up
    setTimeout(() => this.errorMessage = '', 3000);
  }
}