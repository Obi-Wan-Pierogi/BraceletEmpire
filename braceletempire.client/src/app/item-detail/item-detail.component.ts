import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ItemService } from '../services/item.service';
import { CartService } from '../services/cart.service';
import { Item } from '../interfaces/item';
import { NotificationComponent } from '../notification/notification.component';
import { isBracelet, isKeychain } from '../type-guards';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit, OnDestroy {
  @ViewChild('notification') notification!: NotificationComponent;

  item: Item | null = null;
  quantity: number = 1;
  isLoading: boolean = true;
  hasError: boolean = false;
  isAddingToCart: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.route.params.subscribe(params => {
        const itemId = +params['id']; 
        if (itemId) {
          this.loadItem(itemId);
        } else {
          this.router.navigate(['/products']);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadItem(itemId: number): void {
    this.isLoading = true;
    this.hasError = false;

    this.subscription.add(
      this.itemService.getAllItems().subscribe({
        next: (items) => {
          this.item = items.find(item => item.itemId === itemId) || null;
          this.isLoading = false;

          if (!this.item) {
            this.hasError = true;
          }
        },
        error: (error) => {
          console.error('Error loading item:', error);
          this.isLoading = false;
          this.hasError = true;
        }
      })
    );
  }

  addToCart(): void {
    if (!this.item) return;

    this.isAddingToCart = true;

    setTimeout(() => {
      const itemToAdd = { ...this.item! };
      itemToAdd.quantity = this.quantity;

      this.cartService.addToCart(itemToAdd);

      if (this.notification) {
        this.notification.show('Added to cart', 'bottom-right', 'success');
      }

      this.isAddingToCart = false;
    }, 300); // Simulate a small delay for better UX
  }

  incrementQuantity(): void {
    if (this.quantity < 10) {
      this.quantity += 1;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  isBracelet(item: Item): boolean {
    return isBracelet(item);
  }

  isKeychain(item: Item): boolean {
    return isKeychain(item);
  }

  getSpecificAttribute(item: Item): string {
    if (isBracelet(item) && 'braceletSpecificAttribute' in item) {
      return (item as any).braceletSpecificAttribute || '';
    }
    if (isKeychain(item) && 'keychainSpecificAttribute' in item) {
      return (item as any).keychainSpecificAttribute || '';
    }
    return '';
  }

  navigateBack(): void {
    window.history.back();
  }

  isNewProduct(item: Item): boolean {
    // Placeholder logic
    return item.itemId % 3 === 0; // Shows "New" badge on every third item
  }
}
