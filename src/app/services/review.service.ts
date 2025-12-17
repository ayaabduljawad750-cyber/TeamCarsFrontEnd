// review.service.ts
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private baseUrl = 'http://localhost:3000/review';

  constructor(private http: HttpClient) {}
    private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('token'); // Or wherever you store it
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }

  addReview(productId: string, evaluation: number) {
    return this.http.post(this.baseUrl, {
      product: productId,
      evaluation
    },{headers: this.getHeaders()}
  );
  }

  getProductRating(productId: string) {
    return this.http.get(`${this.baseUrl}/product/${productId}`,{headers: this.getHeaders()});
  }
}
