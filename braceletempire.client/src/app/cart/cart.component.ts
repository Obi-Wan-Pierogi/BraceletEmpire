import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../services/cart.service';
import { Item } from '../interfaces/item';
import { NotificationComponent } from '../notification/notification.component';
import { Bracelet } from '../interfaces/bracelet';
import { Keychain } from '../interfaces/keychain';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  @ViewChild('notification') notification!: NotificationComponent;

  cartItems: Item[] = [];

  // Order summary variables
  subtotal: number = 0;
  shipping: number = 5.99; // Fixed shipping cost
  total: number = 0;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

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

  incrementQuantity(item: Item): void {
    if (item.quantity < 10) { // Set a reasonable max quantity
      item.quantity += 1;
      this.cartService.updateItemQuantity(item.itemId, item.quantity);
      if (this.notification) {
        this.notification.show('Quantity updated', 'bottom-right');
      }
    }
  }

  decrementQuantity(item: Item): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.cartService.updateItemQuantity(item.itemId, item.quantity);
      if (this.notification) {
        this.notification.show('Quantity updated', 'bottom-right');
      }
    }
  }

  updateQuantity(item: Item, event: any): void {
    const value = parseInt(event.target.value, 10);

    if (isNaN(value) || value < 1) {
      item.quantity = 1;
    } else if (value > 10) {
      item.quantity = 10;
    } else {
      item.quantity = value;
    }

    this.cartService.updateItemQuantity(item.itemId, item.quantity);
    if (this.notification) {
      this.notification.show('Quantity updated', 'bottom-right');
    }
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId);
    if (this.notification) {
      this.notification.show('Item removed from cart', 'bottom-right');
    }
  }

  clearCart(): void {
    // Confirm before clearing the cart
    if (confirm('Are you sure you want to remove all items from your cart?')) {
      this.cartService.clearCart();
      if (this.notification) {
        this.notification.show('Cart cleared', 'bottom-right');
      }
    }
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  // Type guard methods for template
  isBracelet(item: Item): boolean {
    return item.itemType === 'Bracelet';
  }

  isKeychain(item: Item): boolean {
    return item.itemType === 'Keychain';
  }

  // Helper methods to safely access specific attributes
  getBraceletAttribute(item: Item): string {
    if (this.isBracelet(item) && 'braceletSpecificAttribute' in item) {
      return (item as any).braceletSpecificAttribute || '';
    }
    return '';
  }

  getKeychainAttribute(item: Item): string {
    if (this.isKeychain(item) && 'keychainSpecificAttribute' in item) {
      return (item as any).keychainSpecificAttribute || '';
    }
    return '';
  }
}
