import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders';

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
   
  createOrder(d:any){

  }
}
