import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
// Import your custom validator
import { BackendValidators } from '../../validators/backend.validators'; 

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  // State Management
  currentStep = 1;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Forms
  emailForm!: FormGroup;
  codeForm!: FormGroup;
  passwordForm!: FormGroup;

  // Stored Data
  savedEmail = '';
  savedCode = '';

  // UI Toggles
  typePassword = false;
  typeConfirm = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // --- STEP 1: EMAIL FORM ---
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // --- STEP 2: VERIFICATION CODE FORM ---
    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(4)]]
    });

    // --- STEP 3: NEW PASSWORD FORM (Using Custom Validator) ---
    this.passwordForm = this.fb.group({
      newPassword: ['', [
        Validators.required, 
        BackendValidators.strongPasswordValidator() // <--- YOUR CUSTOM VALIDATOR
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // --- VALIDATORS & HELPERS ---
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('newPassword')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  togglePassword() { this.typePassword = !this.typePassword; }
  toggleConfirm() { this.typeConfirm = !this.typeConfirm; }

  // --- NAVIGATION HELPERS ---
  goBackStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage = '';
      this.successMessage = '';
    } else {
      this.router.navigate(['/login']);
    }
  }

  // --- ACTIONS ---

  // Step 1 -> 2
  sendCode() {
    if (this.emailForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    const email = this.emailForm.get('email')?.value;

    this.auth.sendVerificationCode({ email }).subscribe({
      next: () => {
        this.isLoading = false;
        this.savedEmail = email;
        this.currentStep = 2;
        this.successMessage = `Code sent to ${email}`;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Could not send code. User may not exist.';
      }
    });
  }

  // Step 2 -> 3
  verifyCode() {
    if (this.codeForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    const code = this.codeForm.get('code')?.value;

    this.auth.verifyVerificationCode({ 
      email: this.savedEmail, 
      verificationCode: code 
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.savedCode = code;
        this.currentStep = 3;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Invalid Verification Code';
      }
    });
  }

  // Step 3 -> Finish
  changePassword() {
    if (this.passwordForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    const newPass = this.passwordForm.get('newPassword')?.value;

    this.auth.changePassword({
      email: this.savedEmail,
      verificationCode: this.savedCode,
      newPassword: newPass
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Failed to reset password';
      }
    });
  }
}