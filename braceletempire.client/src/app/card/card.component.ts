// braceletempire.client/src/app/card/card.component.ts
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Item } from '../interfaces/item';
import { Bracelet } from '../interfaces/bracelet';
import { Keychain } from '../interfaces/keychain';
import { CartService } from '../services/cart.service';
import { isBracelet, isKeychain } from '../type-guards';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() item!: Item;
  @ViewChild('notification') notification!: NotificationComponent;

  braceletSpecificAttribute?: string;
  keychainSpecificAttribute?: string;
  isAddingToCart = false;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.extractSpecificAttributes();
  }

  private extractSpecificAttributes(): void {
    if (isBracelet(this.item)) {
      this.braceletSpecificAttribute = this.item.braceletSpecificAttribute;
    }
    if (isKeychain(this.item)) {
      this.keychainSpecificAttribute = this.item.keychainSpecificAttribute;
    }
  }

  addToCart(): void {
    this.isAddingToCart = true;

    setTimeout(() => {
      if (!this.item.quantity) {
        this.item.quantity = 1;
      }

      this.cartService.addToCart(this.item);
      this.notification.show('Added to cart', 'top-center');
      this.isAddingToCart = false;
    }, 300); // Simulate a small delay for better UX
  }

  isNewProduct(item: Item): boolean {
    // This is a placeholder logic - in real implementation,
    // you might want to check based on created date or a flag in the database
    return item.itemId % 3 === 0; // Just for demo, shows "New" badge on every third item
  }
}
