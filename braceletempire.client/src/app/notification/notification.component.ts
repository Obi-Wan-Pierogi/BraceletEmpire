import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  @Input() message: string = '';
  @Input() position: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' = 'bottom-right';
  isVisible: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  show(message: string, position: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' = 'bottom-right'): void {
    this.message = message;
    this.position = position;
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 3000); // Hide after 3 seconds
  }
}
