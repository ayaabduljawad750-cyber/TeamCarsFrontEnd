import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartProducts: any[] = [];
  totalPrice: number = 0;
  paymentMethods: string[] = ['Credit Card', 'Cash on Delivery', 'PayPal'];

  constructor(private fb: FormBuilder, private orderService: OrderService) { }

  ngOnInit(): void {
    // init form
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      paymentMethod: ['', Validators.required]
    });

    // load cart items
    this.loadCart();
  }

  loadCart() {
    const cart = localStorage.getItem('cart');
    this.cartProducts = cart ? JSON.parse(cart) : [];
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPrice = this.cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  updateQuantity(item: any, value: number) {
    const qty = Number(value);
    if (qty < 1) return;
    item.quantity = qty;
    this.calculateTotal();
    localStorage.setItem('cart', JSON.stringify(this.cartProducts));
  }

  placeOrder() {
    if (this.cartProducts.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (this.checkoutForm.invalid) {
      alert("Please fill all required fields correctly!");
      return;
    }

    const orderData = {
      items: {
        products: this.cartProducts.map(p => ({
          productId: p._id,
          quantity: p.quantity
        }))
      },
      userDetails: {
        fullName: this.checkoutForm.value.fullName,
        email: this.checkoutForm.value.email,
        address: this.checkoutForm.value.address,
        phone: this.checkoutForm.value.phone
      },
      paymentMethod: this.checkoutForm.value.paymentMethod,
      totalPrice: this.totalPrice
    };

    // this.orderService.createOrder(orderData).subscribe({
    //   next: (res: any) => {
    //     alert("Order placed successfully!");
    //     this.cartProducts = [];
    //     this.totalPrice = 0;
    //     this.checkoutForm.reset();
    //     localStorage.removeItem('cart');
    //   },
    //   error: err => console.error(err)
    // });
  }
}
