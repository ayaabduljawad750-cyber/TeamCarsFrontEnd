import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from './cart.service';

// Environment configuration
const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};

export interface OrderData {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  paymentMethod: 'cash' | 'card' | string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
    email?: string;
  };
  cardDetails?: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
  };
}

export interface Order {
  _id: string;
  userId: string;
  items: Array<{
    productId: any;
    quantity: number;
    price: number;
    totalItemPrice: number;
  }>;
  totalPrice: number;
  paymentMethod: string;
  status: 'pending' | 'paid' | 'cancelled';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
    email?: string;
  };
  cardDetails?:any;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusUpdate {
  status: 'paid' | 'cancelled';
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Create a new order
  createOrder(orderData: OrderData): Observable<{success: boolean; message: string; data: Order}> {
    return this.http.post<{success: boolean; message: string; data: Order}>(
      this.apiUrl,
      orderData,
      { headers: this.getAuthHeaders() }
    );
  }

  // Create order from cart items
  createOrderFromCart(cartItems: CartItem[], orderData: Partial<OrderData>): Observable<any> {
    const items = cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    const body: OrderData = {
      items,
      paymentMethod: orderData.paymentMethod || 'cash',
      shippingAddress: {
        fullName: orderData.shippingAddress?.fullName || '',
        address: orderData.shippingAddress?.address || '',
        city: orderData.shippingAddress?.city || '',
        phone: orderData.shippingAddress?.phone || '',
        email: orderData.shippingAddress?.email || ''
      },
      cardDetails: orderData.cardDetails
    };

    return this.createOrder(body);
  }

  // Get all orders (admin)
  getAllOrders(): Observable<{success: boolean; data: Order[]; results: number}> {
    return this.http.get<{success: boolean; data: Order[]; results: number}>(
      `${this.apiUrl}/all`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get my orders
  getMyOrders(): Observable<{success: boolean; data: Order[]; results: number,message?:string}> {
    return this.http.get<{success: boolean; data: Order[]; results: number}>(
      `${this.apiUrl}/my`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get order by ID
  getOrderById(id: string): Observable<{success: boolean; data: Order;message?:string}> {
    return this.http.get<{success: boolean; data: Order;message?:string}>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Filter orders (admin)
  filterOrders(filters: {
    status?: string;
    userId?: string;
    paymentMethod?: string;
  }): Observable<{success: boolean; data: Order[]; results: number}> {
    const params: any = {};
    if (filters.status) params.status = filters.status;
    if (filters.userId) params.userId = filters.userId;
    if (filters.paymentMethod) params.paymentMethod = filters.paymentMethod;

    return this.http.get<{success: boolean; data: Order[]; results: number}>(
      this.apiUrl,
      { 
        headers: this.getAuthHeaders(),
        params 
      }
    );
  }

  // User cancels their own order
  cancelMyOrder(orderId: string): Observable<{success: boolean; message: string; data: Order}> {
    return this.http.patch<{success: boolean; message: string; data: Order}>(
      `${this.apiUrl}/cancel/${orderId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // Admin updates order status
  updateOrderStatus(orderId: string, status: 'paid' | 'cancelled'): Observable<{success: boolean; message: string; data: Order}> {
    return this.http.patch<{success: boolean; message: string; data: Order}>(
      `${this.apiUrl}/status/${orderId}`,
      { status },
      { headers: this.getAuthHeaders() }
    );
  }

  // Update order item
  updateOrderItem(orderId: string, itemId: string, updates: {
    productId?: string;
    quantity?: number;
  }): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/updateItem/${orderId}`,
      { itemId, ...updates },
      { headers: this.getAuthHeaders() }
    );
  }

  // Delete order (admin)
  deleteOrder(orderId: string): Observable<{success: boolean; message: string}> {
    return this.http.delete<{success: boolean; message: string}>(
      `${this.apiUrl}/${orderId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Delete order by user
  deleteOrderByUser(userId: string, orderId: string): Observable<{success: boolean; message: string}> {
    return this.http.delete<{success: boolean; message: string}>(
      `${this.apiUrl}/user/${userId}/${orderId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}