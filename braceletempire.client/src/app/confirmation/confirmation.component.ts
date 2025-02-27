import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Order } from '../interfaces/TempOrder';
import { Item } from '../interfaces/item';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  order: Order | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const orderId = params['orderId'];
      if (orderId) {
        this.orderService.getOrder(orderId).subscribe(order => {
          this.order = order;
        });
      }
    });
  }

  getTotal(items: Item[]): number {
    return items.reduce((total, item) => total + item.itemPrice * item.quantity, 0);
  }
}
