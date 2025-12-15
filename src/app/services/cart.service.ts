import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface CartItem {
  productId: string;
  name?: string;
  brand?: string;
  carModel?: string;
  price?: number;
  stock?: number;
  image?: { contentType: string; data: string };
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api';
  private storageKey = 'cart';

  // ✅ BehaviorSubject to track cart count (distinct products)
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  private saveCart(cart: CartItem[]): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.updateCartCount(cart);
  }

  private loadCart(): CartItem[] {
    const data = sessionStorage.getItem(this.storageKey);
    const cart = data ? JSON.parse(data) : [];
    this.updateCartCount(cart);
    return cart;
  }

  // ✅ helper to update cart count (distinct products only)
  private updateCartCount(cart: CartItem[]): void {
    const count = cart.length;
    this.cartCountSubject.next(count);
  }

  getCart(): Observable<CartItem[]> {
    if (this.isLoggedIn()) {
      return this.http.get<any>(`${this.apiUrl}/cart`, {
        headers: this.getAuthHeaders(),
      }).pipe(
        map((res: any) => {
          const items = res?.data?.cart?.items || [];
          const cartItems = items.map((i: any) => {
            let image;
            if (i.productId.image) {
              const img = i.productId.image;
              if (img.data && typeof img.data !== 'string') {
                const byteArray = new Uint8Array(img.data.data || img.data);
                let binary = '';
                byteArray.forEach(b => binary += String.fromCharCode(b));
                const base64 = btoa(binary);
                image = { contentType: img.contentType, data: base64 };
              } else {
                image = { contentType: img.contentType, data: img.data };
              }
            }
            return {
              productId: i.productId._id,
              name: i.productId.name,
              brand: i.productId.brand,
              carModel: i.productId.carModel,
              price: Number(i.productId.price) || 0,
              stock: i.productId.stock,
              image,
              quantity: i.quantity,
            } as CartItem;
          });
          this.updateCartCount(cartItems);
          return cartItems;
        })
      );
    } else {
      return of(this.loadCart());
    }
  }

  addToCart(item: CartItem): Observable<any> {
    if (this.isLoggedIn()) {
      return this.http.post(`${this.apiUrl}/cart`, item, { headers: this.getAuthHeaders() })
        .pipe(tap(() => this.getCart().subscribe())); // refresh count
    } else {
      const cart = this.loadCart();
      const index = cart.findIndex((i) => i.productId === item.productId);
      if (index > -1) {
        cart[index].quantity = item.quantity;
      } else {
        cart.push(item);
      }
      this.saveCart(cart);
      return of(cart);
    }
  }

  updateCart(item: CartItem): Observable<any> {
    if (this.isLoggedIn()) {
      return this.http.put(`${this.apiUrl}/cart`, item, { headers: this.getAuthHeaders() })
        .pipe(tap(() => this.getCart().subscribe())); // refresh count
    } else {
      const cart = this.loadCart();
      const index = cart.findIndex((i) => i.productId === item.productId);
      if (index > -1) {
        if (item.quantity === 0) {
          cart.splice(index, 1);
        } else {
          cart[index].quantity = item.quantity;
        }
      }
      this.saveCart(cart);
      return of(cart);
    }
  }

  clearCart(): Observable<any> {
    if (this.isLoggedIn()) {
      return this.http.delete(`${this.apiUrl}/cart`, { headers: this.getAuthHeaders() })
        .pipe(tap(() => this.cartCountSubject.next(0)));
    } else {
      sessionStorage.removeItem(this.storageKey);
      this.cartCountSubject.next(0);
      return of([]);
    }
  }
}