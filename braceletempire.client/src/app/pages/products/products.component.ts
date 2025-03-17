import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ItemService } from '../../services/item.service';
import { Item } from '../../interfaces/item';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  // All items from API
  allItems: Item[] = [];

  // Filtered items based on current filters
  filteredItems: Item[] = [];

  // Display items (after pagination)
  displayItems: Item[] = [];

  // Loading and error states
  isLoading: boolean = true;
  hasError: boolean = false;

  // Filter state
  selectedCategory: string = 'all';
  sortOption: string = 'default';
  priceMin: number | null = null;
  priceMax: number | null = null;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get query params
    this.subscriptions.add(
      this.route.queryParams.subscribe(params => {
        if (params['category']) {
          this.selectedCategory = params['category'].toLowerCase();
        }

        this.loadProducts();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.hasError = false;

    this.subscriptions.add(
      this.itemService.getAllItems().subscribe({
        next: (items) => {
          this.allItems = items;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.hasError = true;
          this.isLoading = false;
        }
      })
    );
  }

  applyFilters(): void {
    // Start with all items
    let result = [...this.allItems];

    // Apply category filter
    if (this.selectedCategory !== 'all') {
      result = result.filter(item =>
        item.itemType.toLowerCase() === this.selectedCategory
      );
    }

    // Apply price filter
    if (this.priceMin !== null) {
      result = result.filter(item => item.itemPrice >= this.priceMin!);
    }

    if (this.priceMax !== null) {
      result = result.filter(item => item.itemPrice <= this.priceMax!);
    }

    // Apply sorting
    switch (this.sortOption) {
      case 'price-low':
        result.sort((a, b) => a.itemPrice - b.itemPrice);
        break;
      case 'price-high':
        result.sort((a, b) => b.itemPrice - a.itemPrice);
        break;
      case 'name-asc':
        result.sort((a, b) => a.itemName.localeCompare(b.itemName));
        break;
      case 'name-desc':
        result.sort((a, b) => b.itemName.localeCompare(a.itemName));
        break;
      default:
        break;
    }

    // Update filtered items
    this.filteredItems = result;

    // Reset pagination
    this.currentPage = 1;
    this.updateTotalPages();
    this.updateDisplayItems();

    // Update URL if category changed
    if (this.selectedCategory !== 'all') {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { category: this.selectedCategory },
        queryParamsHandling: 'merge'
      });
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { category: null },
        queryParamsHandling: 'merge'
      });
    }
  }

  resetFilters(): void {
    this.selectedCategory = 'all';
    this.sortOption = 'default';
    this.priceMin = null;
    this.priceMax = null;
    this.applyFilters();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updateDisplayItems();

    // Scroll to top of products
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private updateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  private updateDisplayItems(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayItems = this.filteredItems.slice(startIndex, endIndex);
  }
}
