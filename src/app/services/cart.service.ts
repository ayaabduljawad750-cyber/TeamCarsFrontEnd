import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock?: number;
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
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  
  cart$ = this.cartSubject.asObservable();
  private apiUrl = 'http://localhost:3000/api/cart';

  constructor(private http: HttpClient) {
    this.loadCart();
  }


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  loadCart(): void {
    const token = localStorage.getItem('token');
    
    if (token) {
    
      this.http.get<CartResponse>(this.apiUrl, { headers: this.getHeaders() })
        .pipe(
          catchError(error => {
            console.error('Error loading cart from server:', error);

            return this.loadFromLocalStorage();
          })
        )
        .subscribe({
          next: (response) => {
            if (response.success && response.data?.cartItems) {
              this.cartItems = response.data.cartItems;
              this.cartSubject.next(this.cartItems);

              localStorage.setItem('cart', JSON.stringify(this.cartItems));
            } else {
              this.loadFromLocalStorage().subscribe();
            }
          },
          error: (error) => {
            console.error('Error in loadCart:', error);
            this.loadFromLocalStorage().subscribe();
          }
        });
    } else {
      this.loadFromLocalStorage().subscribe();
    }
  }

  private loadFromLocalStorage(): Observable<CartResponse> {
    return new Observable(observer => {
      try {
        const localCart = localStorage.getItem('cart');
        this.cartItems = localCart ? JSON.parse(localCart) : [];
        this.cartSubject.next(this.cartItems);
        observer.next({
          success: true,
          data: { cartItems: this.cartItems }
        });
        observer.complete();
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        this.cartItems = [];
        this.cartSubject.next([]);
        observer.next({
          success: false,
          error: error
        });
        observer.complete();
      }
    });
  }

  addToCart(product: any): Observable<CartResponse> {
    const token = localStorage.getItem('token');
    const productId = product._id || product.productId;
    
    const existingItem = this.cartItems.find(item => item._id === productId);
    
    if (existingItem) {
      return this.updateQuantity(productId, existingItem.quantity + 1).pipe(
        map(response => ({
          ...response,
          message: 'Product quantity increased'
        }))
      );
    }
    
    if (product.stock !== undefined && product.stock <= 0) {
      return of({
        success: false,
        message: 'Product is out of stock'
      });
    }
    
    const newItem: CartItem = {
      _id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: product.stock
    };
    
    // تحديث محلي أولاً
    this.cartItems.push(newItem);
    this.updateLocalCart();
    
    if (token) {
      // إرسال إلى السيرفر
      return this.http.post<CartResponse>(
        this.apiUrl,
        { productId, quantity: 1 },
        { headers: this.getHeaders() }
      ).pipe(
        map(response => {
          if (response.success && response.data?.cartItems) {
            // تحديث البيانات من السيرفر
            this.cartItems = response.data.cartItems;
            this.cartSubject.next(this.cartItems);
            localStorage.setItem('cart', JSON.stringify(this.cartItems));
          }
          return {
            success: true,
            message: 'Product added to cart',
            data: response.data,
            product: newItem
          };
        }),
        catchError(error => {
          console.error('Error adding to cart on server:', error);
          // نبقى على البيانات المحلية
          return of({
            success: true,
            message: 'Product added locally',
            product: newItem,
            error: error.message
          });
        })
      );
    } else {
      // للمستخدم غير المسجل
      return of({
        success: true,
        message: 'Product added to cart',
        product: newItem
      });
    }
  }

  // زيادة كمية منتج
  increaseQty(productId: string): Observable<CartResponse> {
    const item = this.cartItems.find(p => p._id === productId);
    if (!item) {
      return of({
        success: false,
        message: 'Product not found in cart'
      });
    }
    
    // التحقق من المخزون
    if (item.stock !== undefined && item.quantity >= item.stock) {
      return of({
        success: false,
        message: 'Cannot exceed available stock'
      });
    }
    
    return this.updateQuantity(productId, item.quantity + 1);
  }

  // تقليل كمية منتج
  decreaseQty(productId: string): Observable<CartResponse> {
    const item = this.cartItems.find(p => p._id === productId);
    if (!item) {
      return of({
        success: false,
        message: 'Product not found in cart'
      });
    }
    
    if (item.quantity > 1) {
      return this.updateQuantity(productId, item.quantity - 1);
    } else {
      return this.removeItem(productId);
    }
  }

  // تحديث كمية منتج
  private updateQuantity(productId: string, newQuantity: number): Observable<CartResponse> {
    const token = localStorage.getItem('token');
    const item = this.cartItems.find(p => p._id === productId);
    
    if (!item) {
      return of({
        success: false,
        message: 'Product not found in cart'
      });
    }
    
    // تحديث محلي أولاً
    item.quantity = newQuantity;
    this.updateLocalCart();
    
    if (token) {
      return this.http.put<CartResponse>(
        this.apiUrl,
        { productId, quantity: newQuantity },
        { headers: this.getHeaders() }
      ).pipe(
        map(response => {
          if (response.success && response.data?.cartItems) {
            this.cartItems = response.data.cartItems;
            this.cartSubject.next(this.cartItems);
            localStorage.setItem('cart', JSON.stringify(this.cartItems));
          }
          return {
            success: true,
            message: 'Cart updated',
            data: response.data
          };
        }),
        catchError(error => {
          console.error('Error updating quantity on server:', error);
          // نعيد الكمية السابقة
          item.quantity = Math.max(1, newQuantity - 1);
          this.updateLocalCart();
          return of({
            success: false,
            message: 'Failed to update on server',
            error: error.message
          });
        })
      );
    } else {
      return of({
        success: true,
        message: 'Cart updated locally'
      });
    }
  }

  // حذف منتج من الكارت
  removeItem(productId: string): Observable<CartResponse> {
    const token = localStorage.getItem('token');
    
    // تحديث محلي أولاً
    this.cartItems = this.cartItems.filter(item => item._id !== productId);
    this.updateLocalCart();
    
    if (token) {
      return this.http.delete<CartResponse>(
        `${this.apiUrl}/${productId}`,
        { headers: this.getHeaders() }
      ).pipe(
        map(response => ({
          success: true,
          message: 'Product removed from cart',
          data: response.data
        })),
        catchError(error => {
          console.error('Error removing item on server:', error);
          return of({
            success: true,
            message: 'Product removed locally',
            error: error.message
          });
        })
      );
    } else {
      return of({
        success: true,
        message: 'Product removed from cart'
      });
    }
  }

  // تفريغ الكارت
  clearCart(): Observable<CartResponse> {
    const token = localStorage.getItem('token');
    
    // تحديث محلي
    this.cartItems = [];
    this.updateLocalCart();
    localStorage.removeItem('cart');
    
    if (token) {
      return this.http.delete<CartResponse>(
        this.apiUrl,
        { headers: this.getHeaders() }
      ).pipe(
        map(response => ({
          success: true,
          message: 'Cart cleared',
          data: response.data
        })),
        catchError(error => {
          console.error('Error clearing cart on server:', error);
          return of({
            success: true,
            message: 'Cart cleared locally',
            error: error.message
          });
        })
      );
    } else {
      return of({
        success: true,
        message: 'Cart cleared'
      });
    }
  }

  // الحصول على الكارت الحالي
  getMyCart(): CartItem[] {
    return [...this.cartItems];
  }

  // حساب الإجمالي
  getTotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  // حساب عدد العناصر
  getItemCount(): number {
    return this.cartItems.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }

  // مزامنة الكارت المحلي مع السيرفر
  syncCart(): Observable<CartResponse> {
    const token = localStorage.getItem('token');
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (token && localCart.length > 0) {
      return this.http.post<CartResponse>(
        `${this.apiUrl}/sync`,
        { cartItems: localCart },
        { headers: this.getHeaders() }
      ).pipe(
        tap(response => {
          if (response.success && response.data?.cartItems) {
            this.cartItems = response.data.cartItems;
            this.cartSubject.next(this.cartItems);
            localStorage.setItem('cart', JSON.stringify(this.cartItems));
          }
        }),
        map(response => ({
          success: true,
          message: 'Cart synced with server',
          data: response.data
        })),
        catchError(error => {
          console.error('Error syncing cart:', error);
          return of({
            success: false,
            message: 'Failed to sync cart',
            error: error.message
          });
        })
      );
    }
    
    return of({
      success: true,
      message: 'No need to sync'
    });
  }

  // تحديث الكارت المحلي
  private updateLocalCart(): void {
    this.cartSubject.next(this.cartItems);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  // إعادة تحميل الكارت من السيرفر
  reloadCart(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get<CartResponse>(this.apiUrl, { headers: this.getHeaders() })
        .subscribe({
          next: (response) => {
            if (response.success && response.data?.cartItems) {
              this.cartItems = response.data.cartItems;
              this.updateLocalCart();
            }
          },
          error: (error) => {
            console.error('Error reloading cart:', error);
          }
        });
    }
  }
}