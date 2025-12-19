import { Component } from '@angular/core';
import { BookingService, Booking } from '../../services/booking.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent {
  centerId!: string;

  constructor(
    private bookingService: BookingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.centerId = this.route.snapshot.paramMap.get('id') || '';
  }

  submitBooking(formData: any): void {

    const booking: Booking = {
      centerId: this.centerId,                
      userFullName: formData.customerName,    
      userTelephone: formData.phone,
      userEmail: formData.email,
      carModel: formData.carModel,
      ModelYear: formData.modelYear,
      service: formData.serviceType,
      comment: formData.comments,
      status: 'Pending',                      
      date: new Date().toISOString(),         
      serviceName: formData.serviceType       
    };

    this.bookingService.createBooking(booking).subscribe({
      next: (res) => {
        console.log('Booking created:', res);
        alert('Booking submitted successfully!');
      },
      error: (err) => {
        console.error('Error creating booking:', err);
        alert('Error submitting booking');
      }
    });
  }
}
