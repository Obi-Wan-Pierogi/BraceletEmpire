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

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    console.log('Item received in CardComponent:', this.item);
    if (isBracelet(this.item)) {
      this.braceletSpecificAttribute = (this.item as Bracelet).braceletSpecificAttribute;
      console.log('Bracelet specific attribute:', this.braceletSpecificAttribute);
    }
    if (isKeychain(this.item)) {
      this.keychainSpecificAttribute = (this.item as Keychain).keychainSpecificAttribute;
      console.log('Keychain specific attribute:', this.keychainSpecificAttribute);
    }
  }

  addToCart() {
    if (!this.item.quantity) {
      this.item.quantity = 1;
    }
    this.cartService.addToCart(this.item);
    this.notification.show('Item added to cart', 'top-center');
  }

  isBracelet(item: Item): item is Bracelet {
    return isBracelet(item);
  }

  isKeychain(item: Item): item is Keychain {
    return isKeychain(item);
  }
}
