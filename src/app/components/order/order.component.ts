// order.component.ts
import { Component, OnInit } from '@angular/core';
import { OrderService, OrderData } from '../../services/order.service';
import { CartService, CartItem } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  // Form data
  shippingAddress = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'US'
  };
  
  paymentMethod = 'cash';
  acceptTerms = false;
  loading = false;
  errorMsg = '';
  successMsg = '';
  shippingCost = 0; // Free shipping for now
  
  // Cart data
  cartItems: CartItem[] = [];
  
  // Payment modal
  showPaymentModal = false;
  currentOrderId = '';

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadCartPreview();
    
    // Try to get saved address from localStorage
    const savedAddress = localStorage.getItem('shippingAddress');
    if (savedAddress) {
      try {
        this.shippingAddress = { ...this.shippingAddress, ...JSON.parse(savedAddress) };
      } catch (e) {
        console.error('Error parsing saved address:', e);
      }
    }
  }

  // Load cart items
  loadCartPreview(): void {
    this.cartService.getCart().subscribe((items: CartItem[]) => {
      this.cartItems = items.map(item => ({
        ...item,
        price: Number(item.price) || 0,
        image: item.image ? { 
          contentType: item.image.contentType, 
          data: item.image.data 
        } : undefined
      }));
    });
  }

  // Calculate total
  getTotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity, 
      0
    );
  }

  // Get button text based on payment method
  getButtonText(): string {
    if (this.loading) return 'Processing...';
    
    if (this.paymentMethod === 'cash') {
      return `Place Order - $${this.getTotal() + this.shippingCost}`;
    } else {
      return `Pay Now - $${this.getTotal() + this.shippingCost}`;
    }
  }

  // Handle image display
  getImageSrc(item: CartItem): string | undefined {
    if (item.image) {
      return `data:${item.image.contentType};base64,${item.image.data}`;
    }
    return undefined;
  }

  // Validate form
  validateForm(): boolean {
    if (this.cartItems.length === 0) {
      this.errorMsg = 'Your cart is empty!';
      return false;
    }

    if (!this.acceptTerms) {
      this.errorMsg = 'Please accept the terms and conditions';
      return false;
    }

    // Check required fields
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'country'];
    for (const field of requiredFields) {
      if (!this.shippingAddress[field as keyof typeof this.shippingAddress]) {
        this.errorMsg = `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.shippingAddress.email)) {
      this.errorMsg = 'Please enter a valid email address';
      return false;
    }

    // Phone validation (basic)
    if (this.shippingAddress.phone.length < 8) {
      this.errorMsg = 'Please enter a valid phone number';
      return false;
    }

    return true;
  }

  // Submit order
  async submitOrder() {
    // Reset messages
    this.errorMsg = '';
    this.successMsg = '';
    
    // Validate form
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;

    try {
      // Save address to localStorage
      localStorage.setItem('shippingAddress', JSON.stringify(this.shippingAddress));

      // Prepare order data
      const orderData: OrderData = {
        items: this.cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        paymentMethod: this.paymentMethod,
        shippingAddress: {
          ...this.shippingAddress,
          fullName: this.shippingAddress.fullName.trim(),
          address: this.shippingAddress.address.trim(),
          city: this.shippingAddress.city.trim()
        }
      };

      // Create order
      const response = await this.orderService.createOrder(orderData).toPromise();
      
      if (response && response.success) {
        const orderId = response.data._id;
        
        if (this.paymentMethod === 'cash') {
          // Cash on delivery
          this.handleCashOrder(orderId);
        } else if (this.paymentMethod === 'paymob') {
          // Paymob payment
          this.handlePaymobPayment(orderId);
        }
      } else {
        throw new Error(response?.message || 'Failed to create order');
      }
    } catch (error: any) {
      this.loading = false;
      this.errorMsg = error.error?.message || error.message || 'Something went wrong. Please try again.';
      console.error('Order submission error:', error);
    }
  }

  // Handle cash order
  private handleCashOrder(orderId: string): void {
    this.loading = false;
    this.successMsg = `Order #${orderId} placed successfully! You will pay on delivery.`;
    
    // Clear cart
    this.cartService.clearCart().subscribe(() => {
      // Navigate to order confirmation after a delay
      setTimeout(() => {
        this.router.navigate(['/orders', orderId]);
      }, 2000);
    });
  }

  // Handle Paymob payment
  private handlePaymobPayment(orderId: string): void {
    this.currentOrderId = orderId;
    this.showPaymentModal = true;
    this.loading = false;
  }

  // Proceed to Paymob payment
  async proceedToPayment() {
    this.loading = true;
    this.showPaymentModal = false;
    
    try {
      // Initialize Paymob payment
      await this.orderService.initiatePaymobPayment(
        this.currentOrderId,
        this.shippingAddress.phone,
        this.shippingAddress.email
      );
      
      // Start checking payment status
      this.startPaymentStatusCheck();
      
    } catch (error: any) {
      this.loading = false;
      this.errorMsg = error.message || 'Failed to initiate payment. Please try again.';
    }
  }

  // Check payment status periodically
  private startPaymentStatusCheck(): void {
    const checkInterval = setInterval(async () => {
      try {
        const verification = await this.orderService.verifyPayment(this.currentOrderId).toPromise();
        
        if (verification && verification.paymentStatus === 'paid') {
          clearInterval(checkInterval);
          this.handleSuccessfulPayment();
        } else if (verification && (verification.paymentStatus === 'failed' || verification.paymentStatus === 'cancelled')) {
          clearInterval(checkInterval);
          this.handleFailedPayment();
        }
      } catch (error) {
        console.error('Payment check error:', error);
      }
    }, 5000); // Check every 5 seconds
    
    // Stop checking after 5 minutes
    setTimeout(() => clearInterval(checkInterval), 300000);
  }

  // Handle successful payment
  private handleSuccessfulPayment(): void {
    this.loading = false;
    this.successMsg = 'Payment successful! Your order has been confirmed.';
    
    // Clear cart
    this.cartService.clearCart().subscribe(() => {
      // Navigate to order confirmation
      setTimeout(() => {
        this.router.navigate(['/orders', this.currentOrderId]);
      }, 2000);
    });
  }

  // Handle failed payment
  private handleFailedPayment(): void {
    this.loading = false;
    this.errorMsg = 'Payment failed. Please try again or choose a different payment method.';
  }

  // Close payment modal
  closePaymentModal(): void {
    this.showPaymentModal = false;
  }

  // Navigate back to cart
  goBackToCart(): void {
    this.router.navigate(['/cart']);
  }
}