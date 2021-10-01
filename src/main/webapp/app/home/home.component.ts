import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { IBabyProfile } from 'app/entities/baby/baby-profile/baby-profile.model';
import { BabyProfileService } from 'app/entities/baby/baby-profile/service/baby-profile.service';
import { NapService } from 'app/entities/baby/nap/service/nap.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  babyProfile: IBabyProfile = {};

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private babyProfileService: BabyProfileService,
    private napService: NapService
  ) {}

  ngOnInit(): void {
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
    this.babyProfileService.query().subscribe(
      (res: HttpResponse<IBabyProfile[]>) => {
        this.babyProfiles = res.body ?? [];
        if (this.babyProfiles.length === 1) {
          this.babyProfile = this.babyProfiles[0];
          this.getNapData(this.babyProfile.id!);
        }
      },
      () => {
        // this.onError();
      }
    );
  }

  getNapData(id: number): void {
    this.napService.todayNapsInHourByBabyProfile(id).subscribe(
      (res: HttpResponse<any>) => {
        this.napToday = res.body;

        // calculate success, warning, or danger
        if (this.napToday.sleepHours >= this.napToday.sleepHoursGoal) {
          this.napToday.progress = 'success';
        } else if (this.napToday.sleepHours < 10) {
          this.napToday.progress = 'danger';
        } else if (this.napToday.sleepHours > 10 && this.napToday.sleepHours < this.napToday.sleepHoursGoal) {
          this.napToday.progress = 'warning';
        }
      },
      () => {
        // this.onError();
      }
    );
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
