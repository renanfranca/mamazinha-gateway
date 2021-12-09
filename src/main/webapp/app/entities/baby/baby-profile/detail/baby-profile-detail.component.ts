import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from 'app/core/auth/account.service';
import { DataUtils } from 'app/core/util/data-util.service';
import { HeightService } from 'app/entities/baby/height/service/height.service';
import { HumorHistoryService } from 'app/entities/baby/humor-history/service/humor-history.service';
import { NapService } from 'app/entities/baby/nap/service/nap.service';
import { WeightService } from 'app/entities/baby/weight/service/weight.service';
import { D3ChartService } from 'app/shared/d3-chart.service';
import { IBabyProfile } from '../baby-profile.model';

@Component({
  selector: 'jhi-baby-profile-detail',
  templateUrl: './baby-profile-detail.component.html',
})
export class BabyProfileDetailComponent implements OnInit {
  babyProfile: IBabyProfile | null = null;
  humorAverageNap?: any;
  averageNapHumorLastCurrentWeek: any = {};
  averageNapHumorOptions?: any;
  averageNapHumorData?: any;
  humorAverageHumorHistory?: any;
  latestWeight?: any;
  latestHeight?: any;
  favoriteNapPlace?: any;
  d3ChartTranslate: any = {};
  currentDate = new Date();

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    protected napService: NapService,
    protected humorHistoryService: HumorHistoryService,
    protected weightService: WeightService,
    protected heightService: HeightService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.translateD3Chart(false);

    this.activatedRoute.data.subscribe(({ babyProfile }) => {
      this.babyProfile = babyProfile;
      this.getUserData(this.babyProfile!.id!);
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
    this.d3ChartTranslate.dayOfWeek = 'Day of Week';
    this.d3ChartTranslate.averageNapHumor = 'Average humor after nap';
    this.d3ChartTranslate.angry = 'angry';
    this.d3ChartTranslate.sad = 'sad';
    this.d3ChartTranslate.calm = 'calm';
    this.d3ChartTranslate.happy = 'happy';
    this.d3ChartTranslate.excited = 'excited';
    this.translateService.get('gatewayApp.lastWeek').subscribe((res: string) => {
      this.d3ChartTranslate.lastWeek = res;
    });
    this.translateService.get('gatewayApp.currentWeek').subscribe((res: string) => {
      this.d3ChartTranslate.currentWeek = res;
    });
    this.translateService.get('gatewayApp.dayOfWeek').subscribe((res: string) => {
      this.d3ChartTranslate.dayOfWeek = res;
    });
    this.translateService.get('gatewayApp.averageNapHumor').subscribe((res: string) => {
      this.d3ChartTranslate.averageNapHumor = res;
    });
    this.translateService.get('gatewayApp.angry').subscribe((res: string) => {
      this.d3ChartTranslate.angry = res;
    });
    this.translateService.get('gatewayApp.sad').subscribe((res: string) => {
      this.d3ChartTranslate.sad = res;
    });
    this.translateService.get('gatewayApp.calm').subscribe((res: string) => {
      this.d3ChartTranslate.calm = res;
    });
    this.translateService.get('gatewayApp.happy').subscribe((res: string) => {
      this.d3ChartTranslate.happy = res;
    });
    this.translateService.get('gatewayApp.excited').subscribe((res: string) => {
      this.d3ChartTranslate.excited = res;
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

  isShowWeekAverageNapHumorGraphic(averageNapHumorLastCurrentWeek: any): boolean {
    if (Object.keys(averageNapHumorLastCurrentWeek).length === 0) {
      return false;
    }
    let isShow: boolean = averageNapHumorLastCurrentWeek.lastWeekHumorAverage.some((item: any) => item.humorAverage > 0);
    if (!isShow) {
      isShow = averageNapHumorLastCurrentWeek.currentWeekHumorAverage.some((item: any) => item.humorAverage > 0);
    }
    return isShow;
  }

  getUserData(id: number): void {
    this.getNapData(id);
    this.getHumorHistoryData(id);
    this.getWeightData(id);
    this.getHeightData(id);
  }

  getNapData(id: number): void {
    this.napService.todayAverageNapHumorByBabyProfile(id).subscribe((res: HttpResponse<any>) => {
      this.humorAverageNap = res.body;
    });
    this.napService.favoriteNapPlaceFromLastDaysByBabyProfile(id, 30).subscribe((res: HttpResponse<any>) => {
      this.favoriteNapPlace = res.body;
    });
    this.napService.lastWeekCurrentWeekAverageNapsHumorEachDayByBabyProfile(id).subscribe((res: HttpResponse<any>) => {
      this.averageNapHumorLastCurrentWeek = res.body;
      this.createAverageNapsHumorLastWeekCurrentWeekChart();
    });
  }

  getHumorHistoryData(id: number): void {
    this.humorHistoryService.todayAverageHumorHistoryByBabyProfile(id).subscribe((res: HttpResponse<any>) => {
      this.humorAverageHumorHistory = res.body;
    });
  }

  getWeightData(id: number): void {
    this.weightService.latestWeightByBabyProfile(id).subscribe((res: HttpResponse<any>) => {
      this.latestWeight = res.body;
    });
  }

  getHeightData(id: number): void {
    this.heightService.latestHeightByBabyProfile(id).subscribe((res: HttpResponse<any>) => {
      this.latestHeight = res.body;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }

  private createAverageNapsHumorLastWeekCurrentWeekChart(): void {
    if (Object.keys(this.averageNapHumorLastCurrentWeek).length === 0) {
      return;
    }
    // https://stackoverflow.com/a/34694155/65681
    this.averageNapHumorOptions = { ...D3ChartService.getHumorChartConfig(this.d3ChartTranslate) };
    if (
      this.averageNapHumorLastCurrentWeek.lastWeekHumorAverage.length ||
      this.averageNapHumorLastCurrentWeek.currentWeekHumorAverage.length
    ) {
      this.averageNapHumorOptions.chart.xAxis.axisLabel = this.d3ChartTranslate.dayOfWeek;
      this.averageNapHumorOptions.chart.yAxis.axisLabel = this.d3ChartTranslate.averageNapHumor;

      const lastWeek: { x: any; y: any }[] = [],
        currentWeek: { x: any; y: any }[] = [];

      this.averageNapHumorLastCurrentWeek.lastWeekHumorAverage.forEach((item: any) => {
        lastWeek.push({
          x: item.dayOfWeek,
          y: item.humorAverage,
        });
      });
      this.averageNapHumorLastCurrentWeek.currentWeekHumorAverage.forEach((item: any) => {
        currentWeek.push({
          x: item.dayOfWeek,
          y: item.humorAverage,
        });
      });
      this.averageNapHumorData = [
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
      this.averageNapHumorOptions.chart.yDomain = [0, 5];
    } else {
      this.averageNapHumorLastCurrentWeek.lastWeekHumorAverage = [];
      this.averageNapHumorLastCurrentWeek.currentWeekHumorAverage = [];
    }
  }
}
