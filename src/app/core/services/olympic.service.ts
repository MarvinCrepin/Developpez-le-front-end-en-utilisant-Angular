import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import Olympic from '../models/Olympic';
@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);
  constructor(private http: HttpClient, private router: Router) { }

  public loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        this.olympics$.next([]);
        throw new Error(error)
      })
    );
  }

  public getOlympics() {
    return this.olympics$.asObservable();
  }
  // Prend un ID en paramètre et renvoie un Olympic qui correspond si l'ID existe, sinon je catch l'erreur et renvoie vers la page "not-found"
  public getOlympicById = (id: number) =>
    { return this.olympics$.pipe(
      map(olympics => {
        return olympics.find((olympic: Olympic) => olympic.id === +id)
      }), catchError((error, caught) => {
        this.olympics$.unsubscribe();
        this.router.navigateByUrl("/not-found")
        throw new Error(error)
      }));}
}
