import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<any>(undefined);
  constructor(private http: HttpClient, private router: Router) { }

  public loadInitialData() {
    return this.http.get<any>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  public getOlympics() {
    return this.olympics$.asObservable();
  }

  public getOlympicByCountryName = (country: string) =>
    this.olympics$.pipe(
      map(olympics => olympics.find((olympic: Olympic) =>
        olympic.country.toLocaleLowerCase() === country.toLocaleLowerCase()
      )));

  errorWithOlympics$ = throwError(() => {
    const error: any = new Error(`There is an error with fetching Olympics data.`);
    error.timestamp = Date.now();
    return error;
  });
}
