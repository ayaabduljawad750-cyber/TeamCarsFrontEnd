import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface MaintenanceCenter {
  _id?: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  workingHours?: string[];
  services?: string[];
}

export interface Booking {
  _id: string;
  userFullName: string;
  userTelephone: string;
  carModel: string;
  ModelYear: number;
  service: string;
  comment: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // --- Center Profile ---
  getMyCenter(): Observable<any> {
    return this.http.get(`${this.apiUrl}/centers/my-center`, { headers: this.getAuthHeaders() });
  }

  getCenters(): Observable<any> {
    return this.http.get(`${this.apiUrl}/centers`, { headers: this.getAuthHeaders() });
  }

  

  createCenter(data: MaintenanceCenter): Observable<any> {
    return this.http.post(`${this.apiUrl}/centers`, data, { headers: this.getAuthHeaders() });
  }

  updateCenter(id: string, data: MaintenanceCenter): Observable<any> {
    return this.http.put(`${this.apiUrl}/centers/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteCenter(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/centers/${id}`, { headers: this.getAuthHeaders() });
  }

  // --- Bookings ---
  getMyBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/booking/my-incoming-requests`, { headers: this.getAuthHeaders() });
  }

  updateBookingStatus(bookingId: string, status: 'Accepted' | 'Rejected'): Observable<any> {
    return this.http.patch(`${this.apiUrl}/booking/${bookingId}/status`, { status }, { headers: this.getAuthHeaders() });
  }
}
