// braceletempire.client/src/app/admin/admin.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ItemService } from '../services/item.service';
import { CreateItemDto } from '../interfaces/create-item-dto';
import { NotificationComponent } from '../notification/notification.component';
import { Item } from '../interfaces/item';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  @ViewChild(NotificationComponent) notification: NotificationComponent | undefined;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  // Tab navigation
  activeTab: string = 'add';

  // Form data
  itemDto: CreateItemDto = {
    itemName: '',
    itemDescription: '',
    itemPrice: 0,
    itemType: '',
    braceletSpecificAttribute: '',
    keychainSpecificAttribute: ''
  };

  // File upload
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  // Form state
  isSubmitted: boolean = false;
  isSubmitting: boolean = false;

  // Products management
  products: Item[] = [];
  isLoadingProducts: boolean = false;

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    // Load products when component initializes
    this.loadProducts();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'manage') {
      this.loadProducts();
    }
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.selectedFile = files[0];

      // Create image preview - FIX: Add null check before using selectedFile
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(this.selectedFile);
      }
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    this.isSubmitted = true;

    // Simple validation - just check if empty for required fields
    switch (fieldName) {
      case 'itemName':
        return !this.itemDto.itemName;
      case 'itemDescription':
        return !this.itemDto.itemDescription;
      case 'itemPrice':
        return !this.itemDto.itemPrice || this.itemDto.itemPrice <= 0;
      case 'itemType':
        return !this.itemDto.itemType;
      default:
        return false;
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;

    // Validate all required fields
    if (!this.itemDto.itemName ||
      !this.itemDto.itemDescription ||
      !this.itemDto.itemPrice ||
      !this.itemDto.itemType ||
      !this.selectedFile) {
      if (this.notification) {
        this.notification.show('Please fill all required fields', 'top-center', 'error');
      }
      return;
    }

    this.isSubmitting = true;

    // Ensure selectedFile is not null before sending
    if (this.selectedFile) {
      this.itemService.createItem(this.itemDto, this.selectedFile).subscribe({
        next: (response) => {
          if (this.notification) {
            this.notification.show('Item added successfully', 'top-center', 'success');
          }
          this.resetForm();
          this.isSubmitting = false;

          // Refresh the product list if we're in the manage tab
          if (this.activeTab === 'manage') {
            this.loadProducts();
          }
        },
        error: (error) => {
          console.error('Error creating item:', error);
          if (this.notification) {
            this.notification.show('Error adding item', 'top-center', 'error');
          }
          this.isSubmitting = false;
        }
      });
    } else {
      this.isSubmitting = false;
      if (this.notification) {
        this.notification.show('Please select an image file', 'top-center', 'error');
      }
    }
  }

  resetForm(): void {
    this.itemDto = {
      itemName: '',
      itemDescription: '',
      itemPrice: 0,
      itemType: '',
      braceletSpecificAttribute: '',
      keychainSpecificAttribute: ''
    };
    this.selectedFile = null;
    this.imagePreview = null;
    this.isSubmitted = false;

    // Reset file input
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  loadProducts(): void {
    this.isLoadingProducts = true;

    this.itemService.getAllItems().subscribe({
      next: (items) => {
        this.products = items;
        this.isLoadingProducts = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoadingProducts = false;
        if (this.notification) {
          this.notification.show('Error loading products', 'top-center', 'error');
        }
      }
    });
  }

  confirmDeleteProduct(product: Item): void {
    const confirmDelete = confirm(`Are you sure you want to delete "${product.itemName}"?`);

    if (confirmDelete) {
      // Implementation would require a delete method in the ItemService
      // For now, just show a notification
      if (this.notification) {
        this.notification.show('Delete functionality not implemented yet', 'top-center', 'info');
      }
    }
  }
}
