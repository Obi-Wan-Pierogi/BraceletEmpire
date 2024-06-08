import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/TempOrder';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl; // Update with your actual API URL

  constructor(private http: HttpClient) { }

  createOrder(order: Order): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/Order`, order);
  }

  getOrder(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/Order/${orderId}`);
  }
}
