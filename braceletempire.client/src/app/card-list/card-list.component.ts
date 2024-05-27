
import { Component, OnInit } from '@angular/core';
import { ItemService } from '../services/item.service';
import { Item } from '../interfaces/item';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {
  items: Item[] = [];

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.itemService.getAllItems().subscribe(items => {
      this.items = items;
      console.log('Items received in CardListComponent:', items); // Add console log
    });
  }
}

