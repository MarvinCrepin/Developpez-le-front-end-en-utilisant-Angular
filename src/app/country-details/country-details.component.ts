import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from '@angular/common';
import {Subscription} from "rxjs";
import Olympic from '../core/models/Olympic';
import { OlympicService } from '../core/services/olympic.service';
import { throwError } from 'rxjs';
import Participation from '../core/models/Participation';
import { ChartData } from '../core/models/ChartData';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss']
})
export class CountryDetailsComponent implements OnInit {
 
  country!: string;
  entries: number = 0;
  medalsCount!: number;
  athletesCount!: number;
  subs !: Subscription;
  data!: ChartData;
  olympic?: Olympic
  backgroundColor = ['#B49365', '#A6B7E7', '#7F92DB', '#742D41', '#9F82A1'];
  options = {
    indexAxis: 'x',
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
    this.getOlympicByCountry();
  }

  // Data handling et génération des paramètres d'entrées de mon graphique
  private getOlympicByCountry() {
    const id: number = Number(this.route.snapshot.paramMap.get('id'));
    this.olympicService.getOlympicById(id).subscribe(olympic => this.olympic = olympic)
    if (this.olympic) {
      this.country = this.olympic.country;
      const labels = this.olympic.participations.map((participation: Participation) => participation.year);
      const data =  this.olympic.participations.map((participation: Participation) => participation.medalsCount);
      this.medalsCount = this.olympic.participations.reduce((previousValue, {medalsCount}) => previousValue + medalsCount, 0)
      this.athletesCount = this.olympic.participations.reduce((previousValue, {athleteCount}) => previousValue + athleteCount, 0)
      this.entries = this.olympic.participations.length
      this.data = {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: this.backgroundColor
          }
        ]
      };
    } else {
      this.router.navigateByUrl('/not-found')
    }
    }
        

  back(): void {
    this.location.back();
  }
}
