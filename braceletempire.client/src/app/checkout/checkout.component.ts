import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Item } from '../interfaces/item';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: Item[] = [];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private http: HttpClient,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      const orderDetails = {
        name: this.checkoutForm.value.name,
        address: this.checkoutForm.value.address,
        cartItems: this.cartItems
      };

      // Send order details to email (replace with your backend API)
      this.http.post('/api/sendOrderEmail', orderDetails).subscribe(response => {
        console.log('Order sent:', response);
        // Clear the cart
        this.cartService.clearCart();
        // Navigate to a confirmation page or display a message
        this.router.navigate(['/confirmation']);
      });
    }
  }
}
