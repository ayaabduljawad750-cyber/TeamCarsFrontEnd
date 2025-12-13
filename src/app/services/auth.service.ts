import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }
private currentUserSubject = new BehaviorSubject<any>(null);
currentUser$ = this.currentUserSubject.asObservable();
  login(data: { email: string; password: string }) {
    return this.http.post(`${this.usersUrl}/login`, data).pipe(
    tap((res: any) => {
      localStorage.setItem('token', res.data.token);
      this.currentUserSubject.next(res.data.user); 
    })
  );
  }

  logout(){
    localStorage.removeItem("token")
  }

  isLogin(){
    if(localStorage.getItem('token')){
      return true
    }
    else{
      return false
    }
  }

  register(data: { firstName: string; lastName:string; email: string; password: string }) {
  return this.http.post(
    `${this.usersUrl}/register`,
    data
  );
}

getCurrentUser() {
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get(`${this.usersUrl}/get`, { headers }).pipe(
    tap((res: any) => {
      this.currentUserSubject.next(res.data.user);
    }))
}

}
