import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/all-products.service';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css'],
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

addToCart(product: any) {
  if(this.authService.isLogin()){
    const cartItem: CartItem = {
    productId: product._id,
    name: product.name,
    brand: product.brand,
    carModel: product.carModel,
    price: Number(product.price),
    stock: product.stock,
    // ✅ wrap into object if backend sends {contentType, data}
    image: product.image
      ? { contentType: product.image.contentType, data: product.image.data }
      : undefined,
    quantity: 1,
  };

  this.cartService.addToCart(cartItem).subscribe(() => {
    // handle success
  });
  }
  else{
    this.router.navigate(['login']);
  }
}


}
