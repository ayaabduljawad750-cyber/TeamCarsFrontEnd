import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
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

  // ✅ BehaviorSubject to track cart count (distinct products)
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  // ✅ keep cart in memory only
  private localCart: CartItem[] = [];

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // ✅ helper to update cart count
  private updateCartCount(cart: CartItem[]): void {
    const count = cart.length; // distinct products
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
      this.updateCartCount(this.localCart);
      return new Observable<CartItem[]>(observer => {
        observer.next(this.localCart);
        observer.complete();
      });
    }
  }

  addToCart(item: CartItem): Observable<any> {
    if (this.isLoggedIn()) {
      return this.http.post(`${this.apiUrl}/cart`, item, { headers: this.getAuthHeaders() })
        .pipe(tap(() => this.getCart().subscribe()));
    } else {
      const index = this.localCart.findIndex((i) => i.productId === item.productId);
      if (index > -1) {
        this.localCart[index].quantity = item.quantity;
      } else {
        this.localCart.push(item);
      }
      this.updateCartCount(this.localCart);
      return new Observable(observer => {
        observer.next(this.localCart);
        observer.complete();
      });
    }
  }

  updateCart(item: CartItem): Observable<any> {
    if (this.isLoggedIn()) {
      return this.http.put(`${this.apiUrl}/cart`, item, { headers: this.getAuthHeaders() })
        .pipe(tap(() => this.getCart().subscribe()));
    } else {
      const index = this.localCart.findIndex((i) => i.productId === item.productId);
      if (index > -1) {
        if (item.quantity === 0) {
          this.localCart.splice(index, 1);
        } else {
          this.localCart[index].quantity = item.quantity;
        }
      }
      this.updateCartCount(this.localCart);
      return new Observable(observer => {
        observer.next(this.localCart);
        observer.complete();
      });
    }
  }

  clearCart(): Observable<any> {
    if (this.isLoggedIn()) {
      return this.http.delete(`${this.apiUrl}/cart`, { headers: this.getAuthHeaders() })
        .pipe(tap(() => this.cartCountSubject.next(0)));
    } else {
      this.localCart = [];
      this.cartCountSubject.next(0);
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }
  }
}