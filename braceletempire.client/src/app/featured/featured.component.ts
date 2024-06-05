import { Component, OnInit } from '@angular/core';
import { ItemService } from '../services/item.service';
import { Item } from '../interfaces/item';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.css']
})
export class FeaturedComponent implements OnInit {
  featuredItems: Item[] = [];

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.itemService.getAllItems().subscribe(items => {
      this.featuredItems = this.selectRandomItems(items, 4);
    });
  }

  private selectRandomItems(items: Item[], count: number): Item[] {
    return items.sort(() => 0.5 - Math.random()).slice(0, count);
  }
}


