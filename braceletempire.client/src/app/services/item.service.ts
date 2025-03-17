import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item } from '../interfaces/item';
import { CreateItemDto } from '../interfaces/create-item-dto';
import { map, tap } from 'rxjs/operators';

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

  getItemById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.itemsUrl}/${id}`).pipe(
      map(item => ({
        ...item,
        imageUrl: this.getImageUrl(item.imageUrl)
      }))
    );
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

    return this.http.post<Item>(this.itemsUrl, formData).pipe(
      map(item => ({
        ...item,
        imageUrl: this.getImageUrl(item.imageUrl)
      })),
      tap(() => this.loadItems()) // Refresh the items list after creating
    );
  }

  updateItem(id: number, itemDto: CreateItemDto, image?: File): Observable<any> {
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

    // Only append image if a new one is provided
    if (image) {
      formData.append('image', image);
    }

    // IMPORTANT: Do NOT set content-type header - let the browser set it with the boundary
    return this.http.put(`${this.itemsUrl}/${id}`, formData, {
      // No headers explicitly set for multipart/form-data
      // Angular/browser will set the correct Content-Type with boundary
      observe: 'response' // Get full response to handle status codes properly
    }).pipe(
      tap(() => this.loadItems()) // Refresh the items list after updating
    );
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.itemsUrl}/${id}`).pipe(
      tap(() => {
        // Update local items list after successful deletion
        const currentItems = this.itemsSubject.value;
        const updatedItems = currentItems.filter(item => item.itemId !== id);
        this.itemsSubject.next(updatedItems);
      })
    );
  }

  getImageUrl(imageUrl: string): string {
    if (imageUrl.startsWith('/uploads/')) {
      // Image is stored on the server
      return `https://localhost:7218${imageUrl}`;
    } else if (imageUrl.startsWith('http')) {
      return imageUrl;
    } else {
      // Image is stored in the assets folder
      return `assets/${imageUrl}`;
    }
  }
}
