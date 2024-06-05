import { Component, ViewChild } from '@angular/core';
import { ItemService } from '../services/item.service';
import { CreateItemDto } from '../interfaces/create-item-dto';
import { NotificationComponent } from '../notification/notification.component'; 

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  @ViewChild(NotificationComponent) notification: NotificationComponent | undefined;
  itemDto: CreateItemDto = {
    itemName: '',
    itemDescription: '',
    itemPrice: 0,
    itemType: '',
    braceletSpecificAttribute: '',
    keychainSpecificAttribute: ''
  };
  selectedFile: File | null = null;

  constructor(private itemService: ItemService) { }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.selectedFile) {
      this.itemService.createItem(this.itemDto, this.selectedFile).subscribe(response => {
        if (this.notification) {
          console.log('Item created successfully', response);
          this.notification.show('Item added to database', 'top-center');
        }
        this.resetForm();
      });
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
  }
}
