import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  currentStep = 1;
  selectedRole = '';
  
  commercialFile: File | null = null;
  commercialFileError = '';
  errorMessage = '';
  
  typePassword = false;
  typeConfirm = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Check for saved role
    const storedRole = localStorage.getItem('temp_reg_role');
    if (storedRole) {
      this.selectedRole = storedRole;
      this.currentStep = 2;
    }
  }

  // --- Initialize Reactive Form ---
  initForm() {
    this.registerForm = this.fb.group({
      firstName: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.pattern('^[A-Z][a-zA-Z]*$') // Starts with Cap, letters only
      ]],
      lastName: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.pattern('^[A-Z][a-zA-Z]*$')
      ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8), 
        Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/) // Number, upper, lower
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // --- Custom Validator for Password Match ---
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  // --- Role Selection ---
  selectRole(role: string) {
    this.selectedRole = role;
    localStorage.setItem('temp_reg_role', role);
    this.currentStep = 2;
    this.errorMessage = '';
    this.commercialFile = null;
  }

  goBackToRoles() {
    this.currentStep = 1;
    this.errorMessage = '';
  }

  // --- Form Getters for cleaner HTML ---
  get f() { return this.registerForm.controls; }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // --- Logic ---
  isCommercialRole(): boolean {
    return this.selectedRole === 'seller' || this.selectedRole === 'maintenanceCenter';
  }

  togglePassword() { this.typePassword = !this.typePassword; }
  toggleConfirmPassword() { this.typeConfirm = !this.typeConfirm; }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.commercialFile = file;
      this.commercialFileError = '';
    }
  }

  // --- Submit ---
  register() {
    this.errorMessage = '';
    this.commercialFileError = '';

    // 1. Mark all fields as touched to trigger UI errors
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // 2. Validate File (Manual check as it's not in FormGroup)
    if (this.isCommercialRole() && !this.commercialFile) {
      this.commercialFileError = 'Commercial license image is required';
      return;
    }

    this.isLoading = true;

    // 3. Prepare FormData
    const formData = new FormData();
    formData.append('firstName', this.f['firstName'].value);
    formData.append('lastName', this.f['lastName'].value);
    formData.append('email', this.f['email'].value);
    formData.append('password', this.f['password'].value);
    
    if (this.commercialFile) {
      formData.append('commercial', this.commercialFile);
    }

    // 4. API Call
    this.auth.register(formData, this.selectedRole).subscribe({
      next: () => {
        this.isLoading = false;
        localStorage.removeItem('temp_reg_role');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Registration failed. Please try again.';
      }
    });
  }
}