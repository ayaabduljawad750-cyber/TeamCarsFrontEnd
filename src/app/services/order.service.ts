import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CartItem } from './cart.service';
const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  stripePublicKey: 'sk_test_1122334455'
};

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders';
 private stripePromise = loadStripe(environment.stripePublicKey);
  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getOrders() {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  updateOrderStatus(id: string, status: string) {
    return this.http.patch(`${this.apiUrl}/status/${id}`, { status }, { headers: this.getAuthHeaders() });
  }

  deleteOrder(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
   
 createOrder(cartItems: CartItem[], otherData?: any) {
  const items = cartItems.map(item => ({
    productId: item.productId,
    quantity: item.quantity
  }));
console.log("items",items)
  const body = {
    items,
    ...otherData // زي name, email, address, phone, paymentMethod
  };

  return this.http.post<any>(
    `${environment.apiUrl}/orders`,
    {...body},
    { headers: this.getAuthHeaders() }
  );
}
  
  async pay(clientSecret: string, cardElement: any) {
    const stripe = await this.stripePromise;
    if (!stripe) return;

    return stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement
      }
    });
  }
  async getStripe() {
  return this.stripePromise;
}
}
