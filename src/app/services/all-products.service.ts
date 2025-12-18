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
    
    // Pagination
    if (filters.page) params = params.set('page', filters.page);
    if (filters.limit) params = params.set('limit', filters.limit);
    
    // Filters
    if (filters.category) params = params.set('category', filters.category);
    if (filters.brand) params = params.set('brand', filters.brand);
    if (filters.carModel) params = params.set('carModel', filters.carModel);
    
    // Price range
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice);
    
    // Stock filter
    if (filters.inStock) params = params.set('inStock', filters.inStock);
    
    // Search parameter (searches name, brand, and model)
    if (filters.search) params = params.set('search', filters.search);
    
    // Sorting
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);

    return this.http.get(`${this.apiUrl}`, { params });
  }

}