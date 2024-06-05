import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Item } from '../interfaces/item';
import {ItemService} from '../services/item.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Item[] = [];
  modifiedCartItems: Item[] = [];  // Separate array to track modifications
  displayedTotal: number = 0;  // Displayed total

  constructor(private cartService: CartService, private itemService: ItemService) { }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.modifiedCartItems = items.map(item => ({ ...item }));  // Copy items to track modifications
      this.displayedTotal = this.getTotal(items);  // Initialize displayed total
    });
  }

  addToCart(item: Item): void {
    item.quantity = item.quantity || 1;  // Ensure quantity is set to 1 if not provided
    this.cartService.addToCart(item);
    this.displayedTotal = this.getTotal(this.cartItems);  // Update displayed total when item is added
  }

  removeFromCart(itemId: number): void {
    this.cartService.removeFromCart(itemId);
    this.loadCartItems();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCartItems();
  }

  updateQuantity(itemId: number, quantity: number): void {
    const item = this.modifiedCartItems.find(item => item.itemId === itemId);
    if (item) {
      item.quantity = quantity;
    }
  }

  getTotal(items: Item[]): number {
    return items.reduce((total, item) => total + item.itemPrice * item.quantity, 0);
  }

  refreshCart(): void {
    this.cartItems = this.modifiedCartItems.map(item => ({ ...item }));  // Copy modified items back to cartItems
    this.displayedTotal = this.getTotal(this.cartItems);  // Update displayed total
    this.cartService.updateCartItems(this.cartItems);  // Save changes to the service
  }
  
  getImageUrl(imageUrl: string): string {
    return this.itemService.getImageUrl(imageUrl);
  }
}
