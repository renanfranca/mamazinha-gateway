import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { IBabyProfile } from 'app/entities/baby/baby-profile/baby-profile.model';
import { BabyProfileService } from 'app/entities/baby/baby-profile/service/baby-profile.service';
import { IBreastFeed } from 'app/entities/baby/breast-feed/breast-feed.model';
import { BreastFeedDeleteDialogComponent } from 'app/entities/baby/breast-feed/delete/breast-feed-delete-dialog.component';
import { BreastFeedService } from 'app/entities/baby/breast-feed/service/breast-feed.service';
import { NapDeleteDialogComponent } from 'app/entities/baby/nap/delete/nap-delete-dialog.component';
import { INap } from 'app/entities/baby/nap/nap.model';
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
  napsIncompletes: INap[] = [];
  napOptions: any;
  napData: any;
  breastFeedLastCurrentWeek: any = {};
  breastFeedsToday: INap[] = [];
  breastFeedsIncompletes: INap[] = [];
  breastFeedOptions: any;
  breastFeedData: any;
  babyProfile: IBabyProfile = {};
  d3ChartTranslate: any = {};

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private babyProfileService: BabyProfileService,
    private napService: NapService,
    private breastFeedService: BreastFeedService,
    private translateService: TranslateService,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.translateD3Chart(false);
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

  translateD3Chart(short: boolean): void {
    this.d3ChartTranslate.monday = 'Monday';
    this.d3ChartTranslate.tuesday = 'Tuesday';
    this.d3ChartTranslate.wednesday = 'Wednesday';
    this.d3ChartTranslate.thusday = 'Thusday';
    this.d3ChartTranslate.friday = 'Friday';
    this.d3ChartTranslate.saturday = 'Saturday';
    this.d3ChartTranslate.sunday = 'Sunday';
    this.d3ChartTranslate.lastWeek = 'Last Week';
    this.d3ChartTranslate.currentWeek = 'Current Week';
    this.d3ChartTranslate.goal = 'Goal';
    this.d3ChartTranslate.dayOfWeek = 'Day of Week';
    this.d3ChartTranslate.sleepHours = 'Sleep Hours';
    this.d3ChartTranslate.averageFeedHours = 'Sleep Average Feeding Time (Hours)';
    this.translateService.get('gatewayApp.lastWeek').subscribe((res: string) => {
      this.d3ChartTranslate.lastWeek = res;
    });
    this.translateService.get('gatewayApp.currentWeek').subscribe((res: string) => {
      this.d3ChartTranslate.currentWeek = res;
    });
    this.translateService.get('gatewayApp.goal').subscribe((res: string) => {
      this.d3ChartTranslate.goal = res;
    });
    this.translateService.get('gatewayApp.dayOfWeek').subscribe((res: string) => {
      this.d3ChartTranslate.dayOfWeek = res;
    });
    this.translateService.get('gatewayApp.sleepHours').subscribe((res: string) => {
      this.d3ChartTranslate.sleepHours = res;
    });
    this.translateService.get('gatewayApp.averageFeedHours').subscribe((res: string) => {
      this.d3ChartTranslate.averageFeedHours = res;
    });
    let translateParameter = 'gatewayApp.daysOfWeek.long';
    if (short) {
      translateParameter = 'gatewayApp.daysOfWeek.short';
    }
    this.translateService.get(translateParameter + '.tuesday').subscribe((res: string) => {
      this.d3ChartTranslate.tuesday = res;
    });
    this.translateService.get(translateParameter + '.monday').subscribe((res: string) => {
      this.d3ChartTranslate.monday = res;
    });
    this.translateService.get(translateParameter + '.wednesday').subscribe((res: string) => {
      this.d3ChartTranslate.wednesday = res;
    });
    this.translateService.get(translateParameter + '.thusday').subscribe((res: string) => {
      this.d3ChartTranslate.thusday = res;
    });
    this.translateService.get(translateParameter + '.friday').subscribe((res: string) => {
      this.d3ChartTranslate.friday = res;
    });
    this.translateService.get(translateParameter + '.saturday').subscribe((res: string) => {
      this.d3ChartTranslate.saturday = res;
    });
    this.translateService.get(translateParameter + '.sunday').subscribe((res: string) => {
      this.d3ChartTranslate.sunday = res;
    });
  }

  isShowWeekNapGraphic(napLastCurrentWeek: any): boolean {
    if (Object.keys(napLastCurrentWeek).length === 0) {
      return false;
    }
    let isShow: boolean = napLastCurrentWeek.lastWeekNaps.some((item: any) => item.sleepHours > 0);
    if (!isShow) {
      isShow = napLastCurrentWeek.currentWeekNaps.some((item: any) => item.sleepHours > 0);
    }
    return isShow;
  }

  trackIncompleteNapsId(index: number, item: INap): number {
    return item.id!;
  }

  deleteIncompleteNap(nap: INap): void {
    const modalRef = this.modalService.open(NapDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.nap = nap;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.getNapData(this.babyProfile.id!);
      }
    });
  }

  isShowWeekBreastFeedGraphic(breastFeedLastCurrentWeek: any): boolean {
    if (Object.keys(breastFeedLastCurrentWeek).length === 0) {
      return false;
    }
    let isShow: boolean = breastFeedLastCurrentWeek.lastWeekBreastFeeds.some((item: any) => item.averageFeedHours > 0);
    if (!isShow) {
      isShow = breastFeedLastCurrentWeek.currentWeekBreastFeeds.some((item: any) => item.averageFeedHours > 0);
    }
    return isShow;
  }

  trackIncompleteBreastFeedsId(index: number, item: IBreastFeed): number {
    return item.id!;
  }

  deleteIncompleteBreastFeed(breastFeed: IBreastFeed): void {
    const modalRef = this.modalService.open(BreastFeedDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.breastFeed = breastFeed;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.getBreastFeedData(this.babyProfile.id!);
      }
    });
  }

  getUserData(): void {
    this.babyProfileService.query().subscribe((res: HttpResponse<IBabyProfile[]>) => {
      this.babyProfiles = res.body ?? [];
      if (this.babyProfiles.length === 1) {
        this.babyProfile = this.babyProfiles[0];
        this.getNapData(this.babyProfile.id!);
        this.getBreastFeedData(this.babyProfile.id!);
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

    this.napService.incompleteNapsByBabyProfile(id).subscribe((res: HttpResponse<any>) => {
      this.napsIncompletes = res.body ?? [];
    });

    this.napService.lastWeekCurrentWeekNapsInHoursEachDayByBabyProfile(id).subscribe((res: HttpResponse<any>) => {
      this.napLastCurrentWeek = res.body;
      // https://stackoverflow.com/a/34694155/65681
      this.napOptions = { ...D3ChartService.getChartConfig(this.d3ChartTranslate) };
      if (this.napLastCurrentWeek.lastWeekNaps.length || this.napLastCurrentWeek.currentWeekNaps.length) {
        this.napOptions.chart.xAxis.axisLabel = this.d3ChartTranslate.dayOfWeek;
        this.napOptions.chart.yAxis.axisLabel = this.d3ChartTranslate.sleepHours;

        const lastWeek: { x: any; y: any }[] = [],
          currentWeek: { x: any; y: any }[] = [],
          sleepHoursGoal: { x: any; y: any }[] = [],
          upperValues: any[] = [],
          lowerValues: any[] = [];

        this.napLastCurrentWeek.lastWeekNaps.forEach((item: any) => {
          lastWeek.push({
            x: item.dayOfWeek,
            y: item.sleepHours,
          });
          sleepHoursGoal.push({
            x: item.dayOfWeek,
            y: this.napLastCurrentWeek.sleepHoursGoal,
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
            values: sleepHoursGoal,
            key: this.d3ChartTranslate.goal,
            color: '#91f1a2',
          },
          {
            values: lastWeek,
            key: this.d3ChartTranslate.lastWeek,
            color: '#eb00ff',
          },
          {
            values: currentWeek,
            key: this.d3ChartTranslate.currentWeek,
            color: '#0077ff',
          },
        ];
        // set y scale to be 10 more than max and min
        this.napOptions.chart.yDomain = [0, 24];
      } else {
        this.napLastCurrentWeek.lastWeekNaps = [];
        this.napLastCurrentWeek.currentWeekNaps = [];
      }
    });
  }

  getBreastFeedData(id: number): void {
    this.breastFeedService.incompleteBreastFeedsByBabyProfile(id).subscribe((res: HttpResponse<any>) => {
      this.breastFeedsIncompletes = res.body ?? [];
    });

    this.breastFeedService.todayBreastFeedsByBabyProfile(id).subscribe((res: HttpResponse<any>) => {
      this.breastFeedsToday = res.body ?? [];
    });

    this.breastFeedService.lastWeekCurrentWeekAverageBreastFeedsInHoursEachDayByBabyProfile(id).subscribe((res: HttpResponse<any>) => {
      this.breastFeedLastCurrentWeek = res.body;
      // https://stackoverflow.com/a/34694155/65681
      this.breastFeedOptions = { ...D3ChartService.getChartConfig(this.d3ChartTranslate) };
      if (this.breastFeedLastCurrentWeek.lastWeekBreastFeeds.length || this.breastFeedLastCurrentWeek.currentWeekBreastFeeds.length) {
        this.breastFeedOptions.chart.xAxis.axisLabel = this.d3ChartTranslate.dayOfWeek;
        this.breastFeedOptions.chart.yAxis.axisLabel = this.d3ChartTranslate.averageFeedHours;
        this.breastFeedOptions.chart.yAxis.axisLabelDistance = -20;

        const lastWeek: { x: any; y: any }[] = [],
          currentWeek: { x: any; y: any }[] = [],
          upperValues: any[] = [],
          lowerValues: any[] = [];

        this.breastFeedLastCurrentWeek.lastWeekBreastFeeds.forEach((item: any) => {
          lastWeek.push({
            x: item.dayOfWeek,
            y: item.averageFeedHours,
          });

          upperValues.push(item.averageFeedHours);
          lowerValues.push(item.averageFeedHours);
        });
        this.breastFeedLastCurrentWeek.currentWeekBreastFeeds.forEach((item: any) => {
          currentWeek.push({
            x: item.dayOfWeek,
            y: item.averageFeedHours,
          });
          upperValues.push(item.averageFeedHours);
          lowerValues.push(item.averageFeedHours);
        });
        this.breastFeedData = [
          {
            values: lastWeek,
            key: this.d3ChartTranslate.lastWeek,
            color: '#eb00ff',
          },
          {
            values: currentWeek,
            key: this.d3ChartTranslate.currentWeek,
            color: '#0077ff',
          },
        ];
        // set y scale to be 10 more than max and min
        this.breastFeedOptions.chart.yDomain = [0, Math.max(...upperValues) + 2];
      } else {
        this.breastFeedLastCurrentWeek.lastWeekBreastFeeds = [];
        this.breastFeedLastCurrentWeek.currentWeekBreastFeeds = [];
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
