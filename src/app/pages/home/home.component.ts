import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import Olympic from 'src/app/core/models/Olympic';
import Participation from 'src/app/core/models/Participation';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  data!: any;
  options!: any;
  subs !: Subscription;
  countryCount !: number
  olympicCount!: number
  backgroundColors = ['#7E4D71', '#A3B2E1', '#5A6FA4', '#A07D83', '#C9A6B6']
  chartOptions = {
    "responsive": true,
    maintainAspectRatio: true,
    showScale: false,
  }
  constructor(private olympicService: OlympicService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.subs = this.getOlympics();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getOlympics(): Subscription {
    return this.olympicService.getOlympics().subscribe(
      {
        next: (olympics: Olympic[]) => {
          const labels: string[] = olympics.map((olympic) => olympic.country)
          const medalsCount: number[] = olympics.map((olympic) => olympic.participations.reduce((previousValue, { medalsCount }) => previousValue + medalsCount, 0))
          this.olympicCount = olympics.map((olympic) => olympic.participations.length)[0]
          this.data = {
            labels: labels,
            datasets: [
              {
                data: medalsCount,
                backgroundColor: this.backgroundColors
              }
            ]
          };
          this.countryCount = labels.length;
        },
        error: err => {
          this.subs.unsubscribe();
          this.router.navigateByUrl("/not-found")
          throw new Error('An error happened. Please try again later.')
        }
      });
  };

  getCountry(e: Event): void {

  }
}
