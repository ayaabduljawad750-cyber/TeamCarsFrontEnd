import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersUrl = 'http://localhost:3000/users';
  

  // Current User State
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  // ================= HELPERS =================
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ================= LOGIN =================
  login(data: { email: string; password: string }) {
    return this.http.post(`${this.usersUrl}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user.role);
        this.currentUserSubject.next(res.data.user);
      }),
      catchError(err => throwError(() => err))
    );
  }

  // ================= REGISTER =================
  register(data: any, role: string) {
    return this.http.post(`${this.usersUrl}/register/${role}`, data);
  }

  // ================= LOGOUT =================
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.currentUserSubject.next(null);
  }

  isLogin() {
    return !!this.getToken();
  }

  // ================= USER PROFILE =================
  getCurrentUser() {
    return this.http.get(`${this.usersUrl}/get`, { headers: this.getAuthHeaders() }).pipe(
      tap((res: any) => {
        this.currentUserSubject.next(res.data.user);
      }),
      catchError(err => throwError(() => err))
    );
  }

  updateUser(data: { firstName: string; lastName: string }) {
    return this.http.put(`${this.usersUrl}/update`, data, { headers: this.getAuthHeaders() }).pipe(
      tap((res: any) => {
        const updatedUser = { ...this.currentUserSubject.value, ...data };
        this.currentUserSubject.next(updatedUser);
      }),
      catchError(err => throwError(() => err))
    );
  }

  updateMyPassword(data: { oldPassword: string; newPassword: string }) {
    return this.http.put(`${this.usersUrl}/update/password`, data, { headers: this.getAuthHeaders() });
  }

  // ================= FORGOT PASSWORD =================
  sendVerificationCode(data: { email: string }) {
    return this.http.post(`${this.usersUrl}/send/verificationCode`, data);
  }

  verifyVerificationCode(data: { email: string; verificationCode: string }) {
    return this.http.post(`${this.usersUrl}/verify/verificationCode`, data);
  }

  changePassword(data: { email: string; verificationCode: string; newPassword: string }) {
    return this.http.post(`${this.usersUrl}/change/password`, data);
  }

  // ================= ADMIN FUNCTIONS =================
getAllUsers(params?: any) {
  return this.http.get(`${this.usersUrl}`, {
    headers: this.getAuthHeaders(),
    params,
  });
}


  updateUserByAdmin(id: string, data: any) {
    return this.http.put(`${this.usersUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteUserByAdmin(id: string) {
    return this.http.delete(`${this.usersUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}