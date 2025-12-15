

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  @ViewChild('cardElement') cardElement!: ElementRef; 
  stripe: any;
   elements: any; 
   card: any;
    loading = false;
     errorMsg:string|undefined = '';
      orderId = 'PUT_ORDER_ID_HERE'; 
      constructor(private OrderService: OrderService) {} 
      async ngOnInit() { 
        this.stripe = await this.OrderService['stripePromise'];
         this.elements = this.stripe.elements(); 
         this.card = this.elements.create('card'); 
         this.card.mount(this.cardElement.nativeElement); 
        } 
        async submit() { 
          this.loading = true;
           this.OrderService.createOrder(this.orderId) .subscribe(async res => 
            { 
              const result = await this.OrderService.pay( res.clientSecret, this.card ); 
              this.loading = false; 
              if (result?.error) { 
                this.errorMsg = result.error.message; 
                console.log(this.errorMsg);
              }
               else { alert('Payment Successful 🎉'); } });
               } 
            }