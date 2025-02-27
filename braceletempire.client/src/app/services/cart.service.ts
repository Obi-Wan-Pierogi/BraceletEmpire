import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Item } from '../interfaces/item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<Item[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      this.cartItemsSubject.next(JSON.parse(savedCart));
    }

    this.cartItems$.subscribe(items => {
      localStorage.setItem('cartItems', JSON.stringify(items));
    });
  }

  addToCart(item: Item): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(i => i.itemId === item.itemId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      item.quantity = item.quantity || 1;
      currentItems.push(item);
    }
    this.cartItemsSubject.next([...currentItems]);
  }

  removeFromCart(itemId: number): void {
    const currentItems = this.cartItemsSubject.value.filter(item => item.itemId !== itemId);
    this.cartItemsSubject.next(currentItems);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }

  getCartItems(): Observable<Item[]> {
    return this.cartItems$;
  }

  updateItemQuantity(itemId: number, quantity: number): void {
    const currentItems = this.cartItemsSubject.value.map(item => {
      if (item.itemId === itemId) {
        item.quantity = quantity;
      }
      return item;
    });
    this.cartItemsSubject.next(currentItems);
  }

  updateCartItems(items: Item[]): void {
    this.cartItemsSubject.next(items);
  }
}
