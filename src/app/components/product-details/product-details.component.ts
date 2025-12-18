import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

// Services
import { ProductService } from 'src/app/services/product.service';
import { ReviewService } from 'src/app/services/review.service';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from 'src/app/services/auth.service';

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
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  selectedRating = 0;
  successMessage = '';
  errorMessage = '';
  warningMessage = ''
  isLoading = false;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private sanitizer: DomSanitizer,
    private reviewService: ReviewService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (res) => {
        this.product = res.data.product;
      },
      error: (err) => {
        this.handleFeedback("error", err.error.message)
      }
    });
  }

  getImageSrc(image: any): string | undefined {
    if (image) {
      return `data:${image.contentType};base64,${image.data}`;
    }
    return undefined;
  }

  setRating(star: number): void {
    this.selectedRating = star;
  }

  submitReview(): void {
    if (!this.product) return;

    this.reviewService
      .addReview(this.product._id, this.selectedRating)
      .subscribe({
        next: () => {
          this.handleFeedback("success", 'Review added successfully!');
          this.loadProduct(this.product!._id);
          this.selectedRating = 0;
        },
        error: (err) => {
          if (err.error.message == "You have already reviewed this product") {
            this.handleFeedback("warning", err.error.message);
          } else {
            this.handleFeedback("error", err.error.message || "Error adding review");
          }
        }
      });
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

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < Math.floor(rating));
  }

  getSellerName(): string {
    if (!this.product?.sellerId) return '';
    return `${this.product.sellerId.firstName} ${this.product.sellerId.lastName}`;
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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