import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }


  login(data: { email: string; password: string }) {
    return this.http.post(`${this.usersUrl}/login`, data);
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

  return this.http.get(`${this.usersUrl}/get`, { headers });
}

}
