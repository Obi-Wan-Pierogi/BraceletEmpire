import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Item } from '../../interfaces/item';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  bracelets: Item[] = [];
  keychains: Item[] = [];

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.itemService.getAllItems().subscribe(items => {
      console.log('Items received in ProductsComponent:', items);
      this.categorizeItems(items);
    }, error => {
      console.error('Error receiving items in ProductsComponent:', error);
    });
  }

  private categorizeItems(items: Item[]): void {
    this.bracelets = items.filter(item => item.itemType === 'Bracelet');
    this.keychains = items.filter(item => item.itemType === 'Keychain');
    console.log('Categorized items - Bracelets:', this.bracelets);
    console.log('Categorized items - Keychains:', this.keychains);
  }
}
