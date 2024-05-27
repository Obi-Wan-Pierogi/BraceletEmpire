//import { Injectable } from '@angular/core';
//import { BehaviorSubject, Observable } from 'rxjs';
//import { HttpClient } from '@angular/common/http';
//import { Item } from '../interfaces/item';

//@Injectable({
//  providedIn: 'root'
//})
//export class ItemService {
//  private itemsUrl = 'https://localhost:7218/api/items';
//  private itemsSubject = new BehaviorSubject<Item[]>([]);
//  items$ = this.itemsSubject.asObservable();

//  constructor(private http: HttpClient) { }

//  getAllItems(): Observable<Item[]> {
//    return this.http.get<Item[]>(this.itemsUrl);
//  }
//}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Item } from '../interfaces/item';

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
    this.http.get<Item[]>(this.itemsUrl).subscribe(items => {
      this.itemsSubject.next(items);
    });
  }

  getAllItems(): Observable<Item[]> {
    return this.items$;
  }
}
