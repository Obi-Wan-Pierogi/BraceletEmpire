// braceletempire.client/src/app/checkout/checkout.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { Item } from '../interfaces/item';
import { Order } from '../interfaces/order';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: Item[] = [];
  checkoutForm: FormGroup;

  // Order summary variables
  subtotal: number = 0;
  shipping: number = 5.99; // Fixed shipping cost
  total: number = 0;

  // Checkout flow control
  currentStep: number = 1;
  isSubmitting: boolean = false;
  orderId: number | null = null;

  private subscriptions: Subscription = new Subscription();

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
    this.subscriptions.add(
      this.cartService.getCartItems().subscribe(items => {
        this.cartItems = items;
        this.updateOrderSummary();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateOrderSummary(): void {
    this.subtotal = this.cartItems.reduce((total, item) =>
      total + (item.itemPrice * item.quantity), 0);

    // If cart is empty or subtotal is 0, set shipping to 0
    this.shipping = this.cartItems.length > 0 ? 5.99 : 0;

    this.total = this.subtotal + this.shipping;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  selectPaymentMethod(method: string): void {
    this.checkoutForm.patchValue({ paymentMethod: method });
  }

  getPaymentMethodLabel(method: string): string {
    switch (method) {
      case 'cashApp': return 'Cash App';
      case 'paypal': return 'PayPal';
      case 'bankTransfer': return 'Bank Transfer';
      default: return '';
    }
  }

  goToReview(): void {
    // First mark all fields as touched to trigger validation
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      control?.markAsTouched();
    });

    // Check if form is valid
    if (this.checkoutForm.valid) {
      this.currentStep = 2;
      // Scroll to top when navigating to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goBack(): void {
    this.currentStep = 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  placeOrder(): void {
    if (this.checkoutForm.valid && this.cartItems.length > 0) {
      this.isSubmitting = true;

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

      this.subscriptions.add(
        this.orderService.createOrder(orderDetails).subscribe({
          next: (orderId) => {
            console.log('Order placed successfully. Order ID:', orderId);
            this.orderId = orderId;
            this.cartService.clearCart();
            this.currentStep = 3;
            this.isSubmitting = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
          },
          error: (error) => {
            console.error('Error placing order:', error);
            // Here you could show an error notification
            this.isSubmitting = false;
          }
        })
      );
    }
  }
}
