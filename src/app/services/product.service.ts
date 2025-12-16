import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Ensure this matches your backend route prefix
  private apiUrl = 'http://localhost:3000/products'; 

  constructor(private http: HttpClient) {}

  // --- HELPER TO GET HEADERS ---
  // We use this because ALL requests need the token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Or wherever you store it
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // --- GET SELLER PRODUCTS ---
  getMyProducts(filters: any): Observable<any> {
    let params = new HttpParams();

    if (filters.page) params = params.set('page', filters.page);
    if (filters.limit) params = params.set('limit', filters.limit);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.brand) params = params.set('brand', filters.brand);
    if (filters.carModel) params = params.set('carModel', filters.carModel);
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);

    // FIX: Pass params and headers in ONE object
    return this.http.get(`${this.apiUrl}/get`, { 
      params: params, 
      headers: this.getHeaders() 
    });
  }

  // --- CREATE PRODUCT ---
  createProduct(data: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('brand', data.brand);
    formData.append('carModel', data.model); 
    formData.append('price', data.price);
    formData.append('stock', data.stock || '1');
    formData.append('category', data.category);
    formData.append('description', data.description || '');
    
    if (file) {
      formData.append('image', file);
    }

    // FIX: Added headers so backend gets req.user.id
    return this.http.post(this.apiUrl, formData, { 
      headers: this.getHeaders() 
    });
  }

  // --- UPDATE PRODUCT ---
  updateProduct(id: string, data: any, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('brand', data.brand);
    formData.append('carModel', data.model);
    formData.append('price', data.price);
    formData.append('category', data.category);
    formData.append('stock', data.stock || '1');
    
    if (file) {
      formData.append('image', file);
    }

    // FIX: Added headers
    return this.http.put(`${this.apiUrl}/${id}`, formData, { 
      headers: this.getHeaders() 
    });
  }

  // --- DELETE PRODUCT ---
  deleteProduct(id: string): Observable<any> {
    // FIX: Added headers
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders() 
    });
  }
}