import { Component } from '@angular/core';
import { ItemService } from '../services/item.service';
import { CreateItemDto } from '../interfaces/create-item-dto';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
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
        console.log('Item created successfully', response);
        // Reset form or provide feedback to the user
      });
    }
  }
}
