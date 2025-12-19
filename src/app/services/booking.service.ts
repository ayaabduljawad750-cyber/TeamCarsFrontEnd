import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  centerId: string;
  userFullName: string;
  serviceName: string;
  userTelephone: string;
  userEmail: string;
  carModel: string;
  ModelYear: number;
  service: string;
  comment: string;
  status: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/bookings'; // endpoint بتاع الباك

  constructor(private http: HttpClient) {}

  // إضافة حجز جديد
  createBooking(booking: Booking): Observable<any> {
    return this.http.post(this.apiUrl, booking);
  }

  // جلب الحجوزات الخاصة بسنتر معين
  getBookingsByCenter(centerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/center/${centerId}`);
  }
}
