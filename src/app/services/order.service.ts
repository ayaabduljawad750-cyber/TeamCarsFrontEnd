import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from './cart.service';

// Environment configuration
const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  paymobIframeId: 'YOUR_PAYMOB_IFRAME_ID' // Get this from Paymob dashboard
};

export interface OrderData {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  paymentMethod: 'cash' | 'paymob' | string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
    email?: string;
  };
}

export interface PaymobPaymentResponse {
  success: boolean;
  paymentKey: string;
  iframeId: string;
  orderId: string;
  amount: number;
  currency: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled';
  data?: any;
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
  status: string;
  paymobOrderId?: string;
  paymobTransactionId?: string;
  confirmationCode?: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
    email?: string;
  };
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  private paymobIframeId = environment.paymobIframeId;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Create a new order
  createOrder(orderData: OrderData): Observable<any> {
    return this.http.post<any>(
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
      }
    };

    return this.createOrder(body);
  }

  // Get Paymob payment key
  getPaymobPaymentKey(orderId: string, phone: string, email?: string): Observable<PaymobPaymentResponse> {
    return this.http.post<PaymobPaymentResponse>(
      `${this.apiUrl}/paymob/payment-key/${orderId}`,
      { phone, email },
      { headers: this.getAuthHeaders() }
    );
  }

  // Initialize Paymob payment
  async initiatePaymobPayment(orderId: string, phone: string, email?: string): Promise<void> {
    try {
      const response = await this.getPaymobPaymentKey(orderId, phone, email).toPromise();
      
      if (response && response.success) {
        // Open Paymob iframe in a new window
        const iframeURL = `https://accept.paymob.com/api/acceptance/iframes/${this.paymobIframeId}?payment_token=${response.paymentKey}`;
        
        // Open in new window
        const paymentWindow = window.open(
          iframeURL, 
          'PaymobPayment',
          'width=500,height=700,scrollbars=yes'
        );

        if (paymentWindow) {
          // Start polling for payment status
          this.startPaymentPolling(orderId, paymentWindow);
        } else {
          throw new Error('Please allow popups for payment');
        }
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      throw error;
    }
  }

  // Poll for payment status
  private startPaymentPolling(orderId: string, paymentWindow: Window): void {
    const pollInterval = setInterval(async () => {
      try {
        // Check if window is closed
        if (paymentWindow.closed) {
          clearInterval(pollInterval);
          this.verifyPayment(orderId).subscribe();
          return;
        }

        // Verify payment status
        const verification = await this.verifyPayment(orderId).toPromise();
        
        if (verification && verification.paymentStatus === 'paid') {
          clearInterval(pollInterval);
          paymentWindow.close();
          
          // Show success message or redirect
          alert('Payment successful!');
          // You can emit an event or use a service to notify other components
        } else if (verification && (verification.paymentStatus === 'failed' || verification.paymentStatus === 'cancelled')) {
          clearInterval(pollInterval);
          paymentWindow.close();
          alert('Payment failed. Please try again.');
        }
      } catch (error) {
        console.error('Payment polling error:', error);
      }
    }, 3000); // Poll every 3 seconds
  }

  // Verify payment status
  verifyPayment(orderId: string): Observable<PaymentVerificationResponse> {
    return this.http.get<PaymentVerificationResponse>(
      `${this.apiUrl}/paymob/verify/${orderId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get all orders (admin)
  getAllOrders(): Observable<{success: boolean, data: Order[], results: number}> {
    return this.http.get<{success: boolean, data: Order[], results: number}>(
      `${this.apiUrl}/all`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get my orders
  getMyOrders(): Observable<{success: boolean, data: Order[], results: number}> {
    return this.http.get<{success: boolean, data: Order[], results: number}>(
      `${this.apiUrl}/my`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get order by ID
  getOrderById(id: string): Observable<{success: boolean, data: Order}> {
    return this.http.get<{success: boolean, data: Order}>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get orders by user ID (admin)
  getOrdersByUserId(userId: string): Observable<{success: boolean, data: Order[], results: number}> {
    return this.http.get<{success: boolean, data: Order[], results: number}>(
      `${this.apiUrl}/user/${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Filter orders (admin)
  filterOrders(filters: {
    status?: string;
    userId?: string;
    paymentMethod?: string;
  }): Observable<{success: boolean, data: Order[], results: number}> {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.userId) queryParams.append('userId', filters.userId);
    if (filters.paymentMethod) queryParams.append('paymentMethod', filters.paymentMethod);

    return this.http.get<{success: boolean, data: Order[], results: number}>(
      `${this.apiUrl}?${queryParams.toString()}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Update order status (admin)
  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/status/${id}`,
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

  // Update item by user
  updateItemByUser(userId: string, orderId: string, itemId: string, updates: {
    productId?: string;
    quantity?: number;
  }): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/updateItem/${userId}/${orderId}`,
      { itemId, ...updates },
      { headers: this.getAuthHeaders() }
    );
  }

  // Delete order (admin)
  deleteOrder(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Delete order by user
  deleteOrderByUser(userId: string, orderId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/user/${userId}/${orderId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}