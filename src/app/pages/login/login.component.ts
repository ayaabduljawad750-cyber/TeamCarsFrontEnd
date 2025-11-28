import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  emailError = ''
  passwordError = ''
  errorMessage = '';

  isValidInputs = true

  fieldTextType: boolean = false;

  togglePasswordVisibility() {
    this.fieldTextType = !this.fieldTextType;
  }

  constructor(private auth: AuthService, private router: Router) { }

  login() {
    // validation email
    if (this.email.length == 0) {
      this.emailError = "Required"
      document.getElementById("email")?.classList.add("error-happen")
      this.isValidInputs = false
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z]{2,})+$/.test(this.email)) {
      this.emailError = "Invalid Email"
      document.getElementById("email")?.classList.add("error-happen")
      this.isValidInputs = false
    }
    else {
      this.emailError = ''
      document.getElementById("email")?.classList.remove("error-happen")
    }

    // validation password
    if (this.password.length == 0) {
      this.passwordError = 'Required'
      document.getElementById("password")?.classList.add("error-happen")
      this.isValidInputs = false
    } else {
      this.passwordError = ''
      document.getElementById("password")?.classList.remove("error-happen")
    }

    if (!this.isValidInputs) {
      return
    }

    const data = {
      email: this.email,
      password: this.password
    };
    this.auth.login(data).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.data.token);
        this.router.navigate(['']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Login failed';
      }
    });
  }
}
