import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';

  lastNameError = ''
  firstNameError = ''
  emailError = ''
  passwordError = ''
  confirmPasswordError = ''

  errorMessage = ''

  isValidInputs = true

  typePassword: boolean = false; // For Main Password
  typeConfirm: boolean = false;  // For Confirm Password

  isPassword(){
    return this.password.length!=0
  }

  togglePassword() {
    this.typePassword = !this.typePassword;
  }

  toggleConfirmPassword() {
    this.typeConfirm = !this.typeConfirm;
  }

  constructor(private auth: AuthService, private router: Router) { }

  register() {

    // validation first name
    if (this.firstName.length == 0) {
      this.firstNameError = 'Required'
      document.getElementById("firstName")?.classList.add("error-happen")
      this.isValidInputs = false
    }
    else if (!/[A-Z]/.test(this.firstName[0])) {
      this.firstNameError = 'First character must be capital'
      document.getElementById("firstName")?.classList.add("error-happen")
      this.isValidInputs = false
    }
    else if (!/[A-Za-z]/.test(this.firstName)) {
      this.firstNameError = 'Must be letters only'
      document.getElementById("firstName")?.classList.add("error-happen")
      this.isValidInputs = false
    }
    else if (this.firstName.length < 3) {
      this.firstNameError = "Must be greater than 3 characters"
      document.getElementById("firstName")?.classList.add("error-happen")
      this.isValidInputs = false
    }
    else {
      this.firstNameError = ''
      document.getElementById("firstName")?.classList.remove("error-happen")
    }

    // validation last name
    if (this.lastName.length == 0) {
      this.lastNameError = 'Required'
      document.getElementById("lastName")?.classList.add("error-happen")
      this.isValidInputs = false
    }
    else if (!/[A-Z]/.test(this.lastName[0])) {
      this.lastNameError = 'First character must be capital'
      document.getElementById("lastName")?.classList.add("error-happen")
      this.isValidInputs = false
    }
    else if (!/[A-Za-z]/.test(this.lastName)) {
      this.lastNameError = 'Must be letters only'
      document.getElementById("lastName")?.classList.add("error-happen")
      this.isValidInputs = false
    }
    else if (this.lastName.length < 3) {
      this.lastNameError = "Must be greater than 3 characters"
      document.getElementById("lastName")?.classList.add("error-happen")
      this.isValidInputs = false
    }
    else {
      this.lastNameError = ''
      document.getElementById("lastName")?.classList.remove("error-happen")
    }

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
    }
    else if (!/\W/.test(this.password)) {
      this.passwordError = 'Must be contain at least one special character'
      document.getElementById("password")?.classList.add("error-happen")
      this.isValidInputs = false
    }
    else if (!/[a-z]/.test(this.password)) {
      this.passwordError = 'Must be contain at least one letter from a to z'
      document.getElementById("password")?.classList.add("error-happen")
      this.isValidInputs = false
    }
    else if (!/[A-Z]/.test(this.password)) {
      this.passwordError = 'Must be contain at least one letter from A to Z'
      document.getElementById("password")?.classList.add("error-happen")
      this.isValidInputs = false
    }
    else if (!/[0-9]/.test(this.password)) {
      this.passwordError = 'Must be contain at least one number from 0 to 9'
      document.getElementById("password")?.classList.add("error-happen")
      this.isValidInputs = false
    }
    else if (this.password.length < 8 || this.password.length > 20) {
      this.passwordError = "Must be between 8 and 20 characters"
      document.getElementById("password")?.classList.add("error-happen")
      this.isValidInputs = false
    }
    else {
      this.passwordError = ''
      document.getElementById("password")?.classList.remove("error-happen")
    }

    if (this.confirmPassword.length == 0) {
      this.confirmPasswordError = 'Required'
      document.getElementById("confirmPassword")?.classList.add("error-happen")
      this.isValidInputs = false
    }
    else if (this.confirmPassword != this.password) {
      this.confirmPasswordError = 'Must be equal password'
      document.getElementById("confirmPassword")?.classList.add("error-happen")
      this.isValidInputs = false
    }
    else {
      this.confirmPasswordError = ''
      document.getElementById("confirmPassword")?.classList.remove("error-happen")
    }


    if (!this.isValidInputs) {
      return
    }

    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    };

    this.auth.register(data).subscribe({
      next: (res: any) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Register failed';
      }
    });
  }
}
