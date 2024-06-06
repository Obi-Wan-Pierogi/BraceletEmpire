import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/TempOrder';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = '/api/order'; // Update with your actual API URL

  constructor(private http: HttpClient) { }

  createOrder(order: Order): Observable<number> {
    return this.http.post<number>(this.apiUrl, order);
  }

  getOrder(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }
}
