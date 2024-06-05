import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Item } from '../interfaces/item';
import { CreateItemDto } from '../interfaces/create-item-dto';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private itemsUrl = 'https://localhost:7218/api/items';
  private itemsSubject = new BehaviorSubject<Item[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadItems();
  }

  private loadItems(): void {
    //this.http.get<Item[]>(this.itemsUrl).subscribe(items => {
    //  this.itemsSubject.next(items);
    //});
    this.http.get<Item[]>(this.itemsUrl).pipe(
      map(items => items.map(item => ({
        ...item,
        imageUrl: this.getImageUrl(item.imageUrl)
      })))
    ).subscribe(items => {
      this.itemsSubject.next(items);
    });
  }

  getAllItems(): Observable<Item[]> {
    return this.items$;
  }

  createItem(itemDto: CreateItemDto, image: File): Observable<Item> {
    const formData = new FormData();
    formData.append('itemName', itemDto.itemName);
    formData.append('itemDescription', itemDto.itemDescription);
    formData.append('itemPrice', itemDto.itemPrice.toString());
    formData.append('itemType', itemDto.itemType);

    if (itemDto.braceletSpecificAttribute) {
      formData.append('braceletSpecificAttribute', itemDto.braceletSpecificAttribute);
    }

    if (itemDto.keychainSpecificAttribute) {
      formData.append('keychainSpecificAttribute', itemDto.keychainSpecificAttribute);
    }

    formData.append('image', image);

    /* return this.http.post<Item>(this.itemsUrl, formData);*/
   return this.http.post<Item>(this.itemsUrl, formData).pipe(
      map(item => ({
        ...item,
        imageUrl: this.getImageUrl(item.imageUrl)
      }))
    );
  }

  getImageUrl(imageUrl: string): string {
    if (imageUrl.startsWith('/uploads/')) {
      // Image is stored on the server
      return `https://localhost:7218${imageUrl}`;
    } else {
      // Image is stored in the assets folder
      return `assets/${imageUrl}`;
    }
  }
}
