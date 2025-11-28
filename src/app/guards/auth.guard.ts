import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  return true;
};
@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // 1. Check if token exists in local storage
    const token = localStorage.getItem('token');

    if (token) {
      // 2. If token exists, allow navigation
      return true;
    } else {
      // 3. If no token, force them back to login
      this.router.navigate(['/login']);
      return false;
    }
  }
}