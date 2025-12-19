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
  shippingCost = 0;
  
  // Card details (only for card payment)
  cardDetails = {
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  };
  
  // Cart data
  cartItems: CartItem[] = [];

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
      return `Pay with Card - $${this.getTotal() + this.shippingCost}`;
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

    // Check required shipping fields
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

    // Card validation if paying by card
    if (this.paymentMethod === 'card') {
      const requiredCardFields = ['cardNumber', 'cardHolder', 'expiryDate', 'cvv'];
      for (const field of requiredCardFields) {
        if (!this.cardDetails[field as keyof typeof this.cardDetails]) {
          this.errorMsg = `Please fill in card ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
          return false;
        }
      }

      // Basic card number validation (at least 13 digits)
      const cardNumber = this.cardDetails.cardNumber.replace(/\s/g, '');
      if (cardNumber.length < 13 || !/^\d+$/.test(cardNumber)) {
        this.errorMsg = 'Please enter a valid card number';
        return false;
      }

      // CVV validation
      if (this.cardDetails.cvv.length < 3 || this.cardDetails.cvv.length > 4) {
        this.errorMsg = 'Please enter a valid CVV (3-4 digits)';
        return false;
      }

      // Expiry date validation (MM/YY format)
      const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
      if (!expiryRegex.test(this.cardDetails.expiryDate)) {
        this.errorMsg = 'Please enter expiry date in MM/YY format';
        return false;
      }
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

      // Add card details if paying by card
      if (this.paymentMethod === 'card') {
        orderData.cardDetails = {
          cardNumber: this.cardDetails.cardNumber,
          cardHolder: this.cardDetails.cardHolder.trim(),
          expiryDate: this.cardDetails.expiryDate.trim(),
          cvv: this.cardDetails.cvv
        };
      }

      // Create order
      const response = await this.orderService.createOrder(orderData).toPromise();
      
      if (response && response.success) {
        const orderId = response.data._id;
        
        if (this.paymentMethod === 'cash') {
          this.handleCashOrder(orderId);
        } else if (this.paymentMethod === 'card') {
          this.handleCardOrder(orderId);
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

  // Handle card order
  private handleCardOrder(orderId: string): void {
    this.loading = false;
    this.successMsg = `Order #${orderId} placed and paid successfully!`;
    
    // Clear cart
    this.cartService.clearCart().subscribe(() => {
      // Navigate to order confirmation after a delay
      setTimeout(() => {
        this.router.navigate(['/orders', orderId]);
      }, 2000);
    });
  }

  // Format card number with spaces
  formatCardNumber(): void {
    let value = this.cardDetails.cardNumber.replace(/\s/g, '').replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.cardDetails.cardNumber = value.substring(0, 19); // Max 16 digits + 3 spaces
  }

  // Format expiry date
  formatExpiryDate(): void {
    let value = this.cardDetails.expiryDate.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.cardDetails.expiryDate = value.substring(0, 5); // MM/YY format
  }

  // Navigate back to cart
  goBackToCart(): void {
    this.router.navigate(['/cart']);
  }
}