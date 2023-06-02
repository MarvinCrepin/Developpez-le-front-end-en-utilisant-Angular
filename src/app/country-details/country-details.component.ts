import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from '@angular/common';
import {Subscription} from "rxjs";
import Olympic from '../core/models/Olympic';
import { OlympicService } from '../core/services/olympic.service';
import { throwError } from 'rxjs';
import Participation from '../core/models/Participation';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss']
})
export class CountryDetailsComponent implements OnInit, OnDestroy {
 
  country!: string;
  entries: number = 0;
  medalsCount!: number;
  athletesCount!: number;
  subs !: Subscription;
  data!: any;
  backgroundColor = ['#B49365', '#A6B7E7', '#7F92DB', '#742D41', '#9F82A1'];
  options = {
    indexAxis: 'y',
    plugins: {
      title: {
        display: true,
        text: `Medals per year`,
        position : 'left'
      },
      legend: {
        display: false
      }
    }
  }
  constructor(private route: ActivatedRoute,
              private olympicService: OlympicService,
              private location: Location,
              private router: Router) {
  }

  ngOnInit(): void {
    this.subs = this.getOlympicByCountry();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private getOlympicByCountry(): Subscription {
    const id: number = Number(this.route.snapshot.paramMap.get('id'));
    return this.olympicService.getOlympicById(id).subscribe(
      {
        next: (olympic: Olympic) => {
          this.country = olympic.country;
          const labels = olympic.participations.map((participation: Participation) => participation.year);
          const data =  olympic.participations.map((participation: Participation) => participation.medalsCount);
          this.medalsCount = olympic.participations.reduce((previousValue, {medalsCount}) => previousValue + medalsCount, 0)
          this.athletesCount = olympic.participations.reduce((previousValue, {athleteCount}) => previousValue + athleteCount, 0)
          this.entries = olympic.participations.length
          this.data = {
            labels: labels,
            datasets: [
              {
                data: data,
                backgroundColor: this.backgroundColor
              }
            ]
          };
        },
        error: err => {
          this.subs.unsubscribe();
          this.router.navigateByUrl("/not-found")
        }
      });
  }

  back(): void {
    this.location.back();
  }
}
