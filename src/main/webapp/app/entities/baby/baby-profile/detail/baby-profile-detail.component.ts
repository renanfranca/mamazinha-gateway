import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { DataUtils } from 'app/core/util/data-util.service';
import { HumorHistoryService } from 'app/entities/baby/humor-history/service/humor-history.service';
import { NapService } from 'app/entities/baby/nap/service/nap.service';
import { WeightService } from 'app/entities/baby/weight/service/weight.service';
import { IBabyProfile } from '../baby-profile.model';

@Component({
  selector: 'jhi-baby-profile-detail',
  templateUrl: './baby-profile-detail.component.html',
})
export class BabyProfileDetailComponent implements OnInit {
  babyProfile: IBabyProfile | null = null;
  humorAverageNap?: any;
  humorAverageHumorHistory?: any;
  latestWeight?: any;
  favoriteNapPlace?: any;
  currentDate = new Date();

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    protected napService: NapService,
    protected humorHistoryService: HumorHistoryService,
    protected weightService: WeightService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ babyProfile }) => {
      this.babyProfile = babyProfile;
      this.getUserData(this.babyProfile!.id!);
    });
  }

  getUserData(id: number): void {
    this.getNapData(id);
    this.getHumorHistoryData(id);
    this.getWeightData(id);
  }

  getNapData(id: number): void {
    this.napService.todayAverageNapHumorByBabyProfile(id).subscribe((res: HttpResponse<any>) => {
      this.humorAverageNap = res.body;
    });
    this.napService.favoriteNapPlaceFromLastDaysByBabyProfile(id, 30).subscribe((res: HttpResponse<any>) => {
      this.favoriteNapPlace = res.body;
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

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
