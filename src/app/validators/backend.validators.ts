import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class BackendValidators {

  // Logic: First letter capital, letters only, 3-20 chars
  static nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null; // Let 'Required' validator handle empty strings

      // 1. First letter must be capital
      if (!/[A-Z]/.test(value[0])) {
        return { notCapitalized: true };
      }

      // 2. Letters only (No numbers or symbols)
      // Your backend regex was looser, but usually names are letters. 
      // Adjust regex to /^[a-zA-Z]+$/ for strict or keep your backend logic
      if (!/^[a-zA-Z]+$/.test(value)) {
        return { invalidChar: true };
      }

      // 3. Length check
      if (value.length < 3 || value.length > 20) {
        return { invalidLength: true };
      }

      return null;
    };
  }

  // Logic: Special char, Lower, Upper, Number, Length > 8
  static strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasSpecial = /\W/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const isValidLength = value.length >= 8;

      const valid = hasSpecial && hasLower && hasUpper && hasNumber && isValidLength;

      if (!valid) {
        return {
          weakPassword: {
            hasSpecial,
            hasLower,
            hasUpper,
            hasNumber,
            isValidLength
          }
        };
      }
      return null;
    };
  }
}