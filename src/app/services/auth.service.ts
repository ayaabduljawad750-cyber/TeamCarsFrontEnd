import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersUrl = 'http://localhost:3000/users';

  // Current User State
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  // ================= LOGIN =================
  login(data: { email: string; password: string }) {
    return this.http.post(`${this.usersUrl}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.data.token);
        this.currentUserSubject.next(res.data.user);
      })
    );
  }

  // ================= REGISTER =================
  register(data: any, role: string) {
    return this.http.post(`${this.usersUrl}/register/${role}`, data);
  }

  // ================= UTILS =================
  logout() {
    localStorage.removeItem("token");
    this.currentUserSubject.next(null);
  }

  isLogin() {
    return !!localStorage.getItem('token');
  }

  getCurrentUser() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get(`${this.usersUrl}/get`, { headers }).pipe(
      tap((res: any) => {
        this.currentUserSubject.next(res.data.user);
      })
    );
  }

  updateUser(data: { firstName: string; lastName: string; }) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.put(`${this.usersUrl}/update`, data, { headers }).pipe(
      tap((res: any) => {
        const updatedUser = { ...this.currentUserSubject.value, ...data };
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  updateMyPassword(data: { oldPassword: string; newPassword: string }) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(`${this.usersUrl}/update/password`, data, { headers });
  }

  sendVerificationCode(data: { email: string }) {
     return this.http.post(`${this.usersUrl}/send/verificationCode`, data);
  }

  verifyVerificationCode(data: { email: string; verificationCode: string }) {
    return this.http.post(`${this.usersUrl}/verify/verificationCode`, data);
  }

  changePassword(data: { email: string; verificationCode: string; newPassword: string }) {
    return this.http.post(`${this.usersUrl}/change/password`, data);
  }

  // ================= NEW =================
  // Getter for userId to fix AllProductsComponent

}
