import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  // Adjust API URL as needed
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // --- Center Profile ---
  getMyCenter(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/centers/my-center`,{headers});
  }

  createCenter(data: MaintenanceCenter): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}/centers`, data,{headers});
  }

  updateCenter(id: string, data: MaintenanceCenter): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(`${this.apiUrl}/centers/${id}`, data,{headers});
  }

  // --- Bookings ---
  getMyBookings(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/booking/my-incoming-requests`,{headers});
  }

  updateBookingStatus(bookingId: string, status: 'Accepted' | 'Rejected'): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.patch(`${this.apiUrl}/booking/${bookingId}/status`, { status },{headers});
  }
}