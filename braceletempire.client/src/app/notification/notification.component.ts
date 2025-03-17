import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  message: string = '';
  position: string = 'top-right';
  type: string = 'success';
  isVisible: boolean = false;
  autoHide: boolean = true;
  hideTimeout: number = 3000;

  private hideTimer: any;
  private notificationSubject = new Subject<void>();
  private subscription: Subscription | null = null;

  constructor() { }

  ngOnInit(): void {
    this.subscription = this.notificationSubject
      .pipe(debounceTime(300)) // Prevent showing multiple notifications in quick succession
      .subscribe(() => {
        this.showNotification();
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.clearHideTimer();
  }

  /**
   * Show a notification.
   * @param message The message to display
   * @param position The position of the notification
   * @param type The type of notification
   * @param autoHide Whether to automatically hide the notification
   * @param hideTimeout Time in ms before the notification is hidden
   */
  show(
    message: string,
    position: string = 'top-right',
    type: string = 'success',
    autoHide: boolean = true,
    hideTimeout: number = 3000
  ): void {
    this.message = message;
    this.position = position;
    this.type = type;
    this.autoHide = autoHide;
    this.hideTimeout = hideTimeout;

    // Queue the notification
    this.notificationSubject.next();
  }

  /**
   * Hide the notification manually
   */
  hide(): void {
    this.isVisible = false;
    this.clearHideTimer();
  }

  private showNotification(): void {
    // First hide any existing notification
    this.isVisible = false;
    this.clearHideTimer();

    // Use setTimeout to ensure CSS transition works properly
    setTimeout(() => {
      this.isVisible = true;

      if (this.autoHide) {
        this.hideTimer = setTimeout(() => {
          this.isVisible = false;
        }, this.hideTimeout);
      }
    }, 10);
  }

  private clearHideTimer(): void {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }
}
