import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface CartItem {
  productId: string;
  quantity?: number;
}

interface CartResponse {
  success: boolean;
  message?: string;
  data?: {
    cartItems: CartItem[];
  };
  product?: CartItem;
  error?: any;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api';
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
  constructor(private http: HttpClient) {}

  addToCart(data: CartItem): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  increaseItem(data: CartItem): Observable<any> {
    return this.http.put(`${this.apiUrl}/cart`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  decreaseItem(data: CartItem): Observable<any> {
    return this.http.put(`${this.apiUrl}/cart`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteItem(data: CartItem): Observable<any> {
    data.quantity = 0;
    return this.http.put(`${this.apiUrl}/cart`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart`, {
      headers: this.getAuthHeaders(),
    });
  }
}
