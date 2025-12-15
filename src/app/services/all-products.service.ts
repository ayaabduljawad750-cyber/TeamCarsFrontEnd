import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000/products'; 

  constructor(private http: HttpClient) {}

  // GET PUBLIC PRODUCTS
  getProducts(filters: any): Observable<any> {
    let params = new HttpParams();
    if (filters.page) params = params.set('page', filters.page);
    if (filters.limit) params = params.set('limit', filters.limit);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);

    return this.http.get(`${this.apiUrl}`, { params });
  }
}
