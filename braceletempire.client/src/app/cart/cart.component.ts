import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Item } from '../interfaces/item';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Item[] = [];
  displayedTotal: number = 0;
  quantities: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(private cartService: CartService, private itemService: ItemService, private router: Router) { }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.displayedTotal = this.getTotal(items);
    });
  }

  addToCart(item: Item): void {
    item.quantity = item.quantity || 1;
    this.cartService.addToCart(item);
    this.displayedTotal = this.getTotal(this.cartItems);
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
    const item = this.cartItems.find(item => item.itemId === itemId);
    if (item) {
      item.quantity = quantity;
      this.cartService.updateItemQuantity(itemId, quantity);
      this.displayedTotal = this.getTotal(this.cartItems);
    }
  }

  getTotal(items: Item[]): number {
    return items.reduce((total, item) => total + item.itemPrice * item.quantity, 0);
  }

  getImageUrl(imageUrl: string): string {
    return this.itemService.getImageUrl(imageUrl);
  }

  navigateToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
