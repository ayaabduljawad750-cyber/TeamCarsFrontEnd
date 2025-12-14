import { Component, OnInit } from '@angular/core';
import {ProductService } from '../../services/all-products.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  products: any[] = [];
  loading: boolean = true;
  totalPages: number = 0;

  filters = {
    page: 1,
    limit: 6,
    category: '',
    search: '',
    sortBy: 'latest'
  };

  categories: string[] = [
    'Spare parts',
    'Tyres',
    'Engine oil',
    'Batteries',
    'Liquids'
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;

    this.productService.getProducts(this.filters).subscribe({
      next: (res: any) => {
        console.log('API RESPONSE:', res);

        this.products = res?.data?.products || [];
        this.totalPages = res?.data?.pages || 0;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }

  changePage(page: number): void {
    this.filters.page = page;
    this.loadProducts();
  }

  search(): void {
    this.filters.page = 1;
    this.loadProducts();
  }

  addToCart(product: any): void {
console.log(product._id);

    this.cartService.addToCart(product).subscribe({
      next: (res: any) => {
        console.log("response",res)
      },
      error: (err: any) => {
        // console.error('Cart error:', err);
        alert(err.message);
      }
    });
  }
}
