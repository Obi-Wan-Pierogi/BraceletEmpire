// braceletempire.client/src/app/pages/front-page/front-page.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css']
})
export class FrontPageComponent implements OnInit {
  isLoading: boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Simulate loading time for featured products
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
  }

  navigateToCategory(category: string): void {
    this.router.navigate(['/products'], {
      queryParams: { category: category.toLowerCase() }
    });
  }
}
