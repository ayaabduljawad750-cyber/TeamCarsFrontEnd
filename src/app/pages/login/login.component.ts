import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  loginForm!: FormGroup;
  fieldTextType: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize Reactive Form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Built-in email validator
      password: ['', [Validators.required]]
    });
  }

  // Helper to toggle password visibility
  togglePasswordVisibility() {
    this.fieldTextType = !this.fieldTextType;
  }

  // Helper to check validity for HTML styling
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  login() {
    // 1. Trigger validation on all fields if user clicks submit immediately
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // 2. Call Service
    this.auth.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        // The service likely handles localStorage, but ensuring it here is fine
        if(res.data && res.data.token) {
           localStorage.setItem('token', res.data.token);
        }
        this.router.navigate(['']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Invalid email or password';
      }
    });
  }
}