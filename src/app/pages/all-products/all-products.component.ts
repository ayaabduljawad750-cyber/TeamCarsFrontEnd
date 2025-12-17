import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/all-products.service';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

interface Product {
  _id: string;
  name: string;
  brand?: string;
  carModel?: string;
  price: number;
  stock: number;
  description?: string;
  category: string;
  evaluation: number;
  image: {
    data: any;
    contentType: string;
  };
  sellerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createAt: string;
  lastUpdateAt: string;
}

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css'],
})
export class AllProductsComponent implements OnInit {
  products: any[] = [];
  loading: boolean = true;
  totalPages: number = 0;
  successMessage = '';
  errorMessage = '';
  warningMessage = ''
  isLoading = false;
  filters = {
    page: 1,
    limit: 6,
    category: '',
    search: '',
    sortBy: 'latest',
  };

  categories: string[] = [
    'Spare parts',
    'Tyres',
    'Engine oil',
    'Batteries',
    'Liquids',
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
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
      },
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

  addToCart(product: Product): void {
    if (!this.authService.isLogin()) {
      this.router.navigate(['login']);
      return;
    }

    const cartItem: CartItem = {
      productId: product._id,
      name: product.name,
      brand: product.brand,
      carModel: product.carModel,
      price: Number(product.price),
      stock: product.stock,
      image: product.image
        ? {
          contentType: product.image.contentType,
          data: product.image.data
        }
        : undefined,
      quantity: 1,
    };

    this.cartService.addToCart(cartItem).subscribe({
      next: () => {
        this.handleFeedback("success", 'Product added to cart!');
      },
      error: (err) => {
        if (err.error.message == "Product is already in your cart") {
          this.handleFeedback("warning", err.error.message);
        } else {
          this.handleFeedback("error", err.error.message || "Something is wrong");
        }

      }
    });
  }
goToDetailsProduct(id:any){

this.router.navigate([`products/${id}`]);
}


  private handleFeedback(type: 'success' | 'error' | 'warning', msg: string) {
    this.isLoading = false;
    if (type === 'success') {
      this.successMessage = msg;
      this.errorMessage = '';
      this.warningMessage = ''
    }
    else if (type == "warning") {
      this.warningMessage = msg
      this.successMessage = '';
      this.errorMessage = '';
    }
    else {
      this.errorMessage = msg;
      this.successMessage = '';
      this.warningMessage = ''
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Clear message after 3 seconds
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
      this.warningMessage = ''
    }, 3000);
  }


}
