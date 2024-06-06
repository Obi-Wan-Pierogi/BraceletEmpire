import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Item } from '../interfaces/item';
import { Order } from '../interfaces/TempOrder';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: Item[] = [];
  total: number = 0;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      paymentMethod: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.total = this.getTotal();
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.itemPrice * item.quantity, 0);
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      const orderDetails: Order = {
        name: this.checkoutForm.value.name,
        email: this.checkoutForm.value.email,
        phone: this.checkoutForm.value.phone,
        streetAddress: this.checkoutForm.value.street,
        city: this.checkoutForm.value.city,
        state: this.checkoutForm.value.state,
        zip: this.checkoutForm.value.zip,
        paymentMethod: this.checkoutForm.value.paymentMethod,
        items: this.cartItems
      };

      this.orderService.createOrder(orderDetails).subscribe(orderId => {
        console.log('Order ID:', orderId);
        // Clear the cart
        this.cartService.clearCart();
        // Navigate to the confirmation page with orderId
        this.router.navigate(['/confirmation'], { queryParams: { orderId } });
      });
    }
  }
}
