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
  @ViewChild('itemForm') itemForm!: NgForm;

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
  isEditing: boolean = false;
  editingItemId: number | null = null;

  // Products management
  products: Item[] = [];
  isLoadingProducts: boolean = false;
  isDeleting: boolean = false;

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

      // Create image preview
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

    // Check if empty for required fields
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
      (!this.selectedFile && !this.isEditing)) {
      if (this.notification) {
        this.notification.show('Please fill all required fields', 'top-center', 'error');
      }
      return;
    }

    this.isSubmitting = true;

    if (this.isEditing && this.editingItemId) {
      // Update existing item
      this.itemService.updateItem(this.editingItemId, this.itemDto, this.selectedFile || undefined).subscribe({
        next: (response) => {
          if (this.notification) {
            this.notification.show('Item updated successfully', 'top-center', 'success');
          }
          this.resetForm();
          this.isSubmitting = false;

          // Go back to manage tab after successful update
          this.setActiveTab('manage');
        },
        error: (error) => {
          console.error('Error updating item:', error);
          if (this.notification) {
            this.notification.show('Error updating item', 'top-center', 'error');
          }
          this.isSubmitting = false;
        }
      });
    } else {
      // Create new item
      if (this.selectedFile) {
        this.itemService.createItem(this.itemDto, this.selectedFile).subscribe({
          next: (response) => {
            if (this.notification) {
              this.notification.show('Item added successfully', 'top-center', 'success');
            }
            this.resetForm();
            this.isSubmitting = false;

            // Go to manage tab after successful creation
            this.setActiveTab('manage');
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
  }

  editItem(item: Item): void {
    // Switch to add/edit tab
    this.activeTab = 'add';
    this.isEditing = true;
    this.editingItemId = item.itemId;

    // Populate form with item data
    this.itemDto = {
      itemName: item.itemName,
      itemDescription: item.itemDescription,
      itemPrice: item.itemPrice,
      itemType: item.itemType,
      braceletSpecificAttribute: item.itemType === 'Bracelet' ? (item as any).braceletSpecificAttribute : '',
      keychainSpecificAttribute: item.itemType === 'Keychain' ? (item as any).keychainSpecificAttribute : ''
    };

    // Set image preview
    this.imagePreview = item.imageUrl;
    this.selectedFile = null;

    // Reset file input
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  deleteItem(item: Item): void {
    if (this.isDeleting) return;

    this.isDeleting = true;
    this.itemService.deleteItem(item.itemId).subscribe({
      next: () => {
        if (this.notification) {
          this.notification.show(`${item.itemName} deleted successfully`, 'top-center', 'success');
        }
        this.loadProducts();
        this.isDeleting = false;
      },
      error: (error) => {
        console.error('Error deleting item:', error);
        if (this.notification) {
          this.notification.show('Error deleting item', 'top-center', 'error');
        }
        this.isDeleting = false;
      }
    });
  }

  confirmDeleteProduct(product: Item): void {
    const confirmDelete = confirm(`Are you sure you want to delete "${product.itemName}"?`);

    if (confirmDelete) {
      this.deleteItem(product);
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
    this.isEditing = false;
    this.editingItemId = null;

    // Reset file input
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }

    // Reset form validation state
    if (this.itemForm) {
      this.itemForm.resetForm();
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
}
