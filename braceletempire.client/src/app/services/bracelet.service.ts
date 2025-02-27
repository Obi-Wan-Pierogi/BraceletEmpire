import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Bracelet } from '../interfaces/bracelet';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BraceletService {

  private braceletsUrl = 'https://localhost:7218/api/bracelets';
  bracelets$: BehaviorSubject<Bracelet[]> = new BehaviorSubject<Bracelet[]>([]);
  bracelet$: Subject<Bracelet> = new Subject<Bracelet>();

  constructor(private http: HttpClient) { }

  getAllBracelets(): Observable<Bracelet[]> {
    this.http.get<Bracelet[]>(this.braceletsUrl).subscribe(response => {
      console.log('API Response:', response);
      this.bracelets$.next(response);
    }, error => {
      console.error("Error fetching bracelets:", error);
    });
    return this.bracelets$.asObservable();
  }

  getBraceletById(id: number): Observable<Bracelet> {
    this.http.get<Bracelet>(`${this.braceletsUrl}/${id}`).subscribe(data => {
      this.bracelet$.next(data);
    });
    return this.bracelet$.asObservable();
  }
}
