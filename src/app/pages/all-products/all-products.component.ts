import { Component, OnInit,HostListener } from '@angular/core';
import { ProductService } from '../../services/all-products.service';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
 import { TranslateService } from '@ngx-translate/core';

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
  warningMessage = '';
  isLoading = false;
  limit = 8

  // Updated filters with more options
  filters = {
    page: 1,
    limit: this.limit,
    category: '',
    brand: '',
    carModel: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    inStock: false,
    search: '',
    sortBy: 'latest',
  };

 categories: string[] = [
  'CATEGORIES.SPARE_PARTS',
  'CATEGORIES.TYRES',
  'CATEGORIES.ENGINE_OIL',
  'CATEGORIES.BATTERIES',
  'CATEGORIES.LIQUIDS'
];

  brands: string[] = []; // Will be populated from API
  carModels: string[] = []; // Will be populated from API
  showAdvancedFilters = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService) {
        const savedLang = localStorage.getItem('lang') || 'en';
    translate.setDefaultLang(savedLang);
    translate.use(savedLang);
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
       }


  ngOnInit(): void {
    this.updateLimitByScreen();
    this.loadProducts();
    // Optional: Load brands and models if you have endpoints for them
    // this.loadBrands();
    // this.loadModels();
  }

  loadProducts(): void {
    this.loading = true;

    // Clean up filters - remove null/undefined/empty values
    const cleanFilters: any = {};
    Object.keys(this.filters).forEach(key => {
      const value = (this.filters as any)[key];
      if (value !== null && value !== undefined && value !== '') {
        cleanFilters[key] = value;
      }
    });

    this.productService.getProducts(cleanFilters).subscribe({
      next: (res: any) => {
        console.log('API RESPONSE:', res);
        this.products = res?.data?.products || [];
        this.totalPages = res?.data?.pages || 0;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading products:', err);
        this.loading = false;
        this.handleFeedback('error', 'Failed to load products');
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

  resetFilters(): void {
    this.filters = {
      page: 1,
      limit: this.limit,
      category: '',
      brand: '',
      carModel: '',
      minPrice: null,
      maxPrice: null,
      inStock: false,
      search: '',
      sortBy: 'latest',
    };
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

  goToDetailsProduct(id: any) {
    this.router.navigate([`products/${id}`]);
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  private handleFeedback(type: 'success' | 'error' | 'warning', msg: string) {
    this.isLoading = false;
    if (type === 'success') {
      this.successMessage = msg;
      this.errorMessage = '';
      this.warningMessage = '';
    } else if (type == "warning") {
      this.warningMessage = msg;
      this.successMessage = '';
      this.errorMessage = '';
    } else {
      this.errorMessage = msg;
      this.successMessage = '';
      this.warningMessage = '';
    }
    window.scrollTo({ top: 600, behavior: 'smooth' });

    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
      this.warningMessage = '';
    }, 3000);
  }

updateLimitByScreen(): void {
  const width = window.innerWidth;

  if (width > 1290) {
    this.limit = 8;
  } else if (width > 930) {
    this.limit = 6;
  } else if(width >630){
    this.limit = 4;
  }else if(width>330){
    this.limit=2
  }else{
    this.limit=1
  }

  this.filters.limit = this.limit;
}

@HostListener('window:resize')
onResize() {
  const oldLimit = this.limit;
  this.updateLimitByScreen();

  if (oldLimit !== this.limit) {
    this.filters.page = 1;
    this.loadProducts();
  }
}

}

