import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { IBabyProfile } from 'app/entities/baby/baby-profile/baby-profile.model';
import { BabyProfileService } from 'app/entities/baby/baby-profile/service/baby-profile.service';
import { NapService } from 'app/entities/baby/nap/service/nap.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { D3ChartService } from './d3-chart.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  currentDate = new Date();
  babyProfiles?: IBabyProfile[];
  napToday: any = {};
  napLastCurrentWeek: any = {};
  napOptions: any;
  napData: any;
  babyProfile: IBabyProfile = {};
  dayOfWeek: any = {};

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private babyProfileService: BabyProfileService,
    private napService: NapService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.dayOfWeek = { monday: 'Mondayy' };
    this.translateService.get('gatewayApp.Place.LAP').subscribe((res: string) => {
      this.dayOfWeek = { monday: res };
    });
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    this.accountService.identity().subscribe(() => {
      if (this.accountService.isAuthenticated()) {
        this.getUserData();
      }
    });
  }

  getUserData(): void {
    this.babyProfileService.query().subscribe((res: HttpResponse<IBabyProfile[]>) => {
      this.babyProfiles = res.body ?? [];
      if (this.babyProfiles.length === 1) {
        this.babyProfile = this.babyProfiles[0];
        this.getNapData(this.babyProfile.id!);
      }
    });
  }

  getNapData(id: number): void {
    this.napService.todayNapsInHourByBabyProfile(id).subscribe((res: HttpResponse<any>) => {
      this.napToday = res.body;

      // calculate success, warning, or danger
      if (this.napToday.sleepHours >= this.napToday.sleepHoursGoal) {
        this.napToday.progress = 'success';
      } else if (this.napToday.sleepHours < 10) {
        this.napToday.progress = 'danger';
      } else if (this.napToday.sleepHours > 10 && this.napToday.sleepHours < this.napToday.sleepHoursGoal) {
        this.napToday.progress = 'warning';
      }
    });

    this.napService.lastWeekCurrentWeekSNapsInHoursEachDayByBabyProfile(id).subscribe((res: HttpResponse<any>) => {
      this.napLastCurrentWeek = res.body;
      // https://stackoverflow.com/a/34694155/65681
      this.napOptions = { ...D3ChartService.getChartConfig(this.dayOfWeek) };
      if (this.napLastCurrentWeek.lastWeekNaps.length || this.napLastCurrentWeek.currentWeekNaps.length) {
        this.napOptions.title.text = 'Semanas';
        this.napOptions.chart.yAxis.axisLabel = 'Horas de Sono';
        // this.napOptions.chart.xAxis.tickFormat = this.tickFormat;

        const lastWeek: { x: any; y: any }[] = [],
          currentWeek: { x: any; y: any }[] = [],
          upperValues: any[] = [],
          lowerValues: any[] = [];

        this.napLastCurrentWeek.lastWeekNaps.forEach((item: any) => {
          lastWeek.push({
            x: item.dayOfWeek,
            y: item.sleepHours,
          });
          upperValues.push(item.sleepHours);
          lowerValues.push(item.sleepHours);
        });
        this.napLastCurrentWeek.currentWeekNaps.forEach((item: any) => {
          currentWeek.push({
            x: item.dayOfWeek,
            y: item.sleepHours,
          });
          upperValues.push(item.sleepHours);
          lowerValues.push(item.sleepHours);
        });
        this.napData = [
          {
            values: lastWeek,
            key: 'Last Week',
            color: '#673ab7',
          },
          {
            values: currentWeek,
            key: 'Current Week',
            color: '#03a9f4',
          },
        ];
        // set y scale to be 10 more than max and min
        this.napOptions.chart.yDomain = [Math.min(...lowerValues), Math.max(...upperValues)];
      } else {
        this.napLastCurrentWeek.lastWeekNaps = [];
        this.napLastCurrentWeek.currentWeekNaps = [];
      }
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
