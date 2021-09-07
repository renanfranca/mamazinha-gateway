import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IHumorHistory, HumorHistory } from '../humor-history.model';
import { HumorHistoryService } from '../service/humor-history.service';
import { IProfile } from 'app/entities/profile/profile/profile.model';
import { ProfileService } from 'app/entities/profile/profile/service/profile.service';

@Component({
  selector: 'jhi-humor-history-update',
  templateUrl: './humor-history-update.component.html',
})
export class HumorHistoryUpdateComponent implements OnInit {
  isSaving = false;

  profilesSharedCollection: IProfile[] = [];

  editForm = this.fb.group({
    id: [],
    humor: [],
    date: [],
    profile: [],
  });

  constructor(
    protected humorHistoryService: HumorHistoryService,
    protected profileService: ProfileService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ humorHistory }) => {
      if (humorHistory.id === undefined) {
        const today = dayjs().startOf('day');
        humorHistory.date = today;
      }

      this.updateForm(humorHistory);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const humorHistory = this.createFromForm();
    if (humorHistory.id !== undefined) {
      this.subscribeToSaveResponse(this.humorHistoryService.update(humorHistory));
    } else {
      this.subscribeToSaveResponse(this.humorHistoryService.create(humorHistory));
    }
  }

  trackProfileById(index: number, item: IProfile): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHumorHistory>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(humorHistory: IHumorHistory): void {
    this.editForm.patchValue({
      id: humorHistory.id,
      humor: humorHistory.humor,
      date: humorHistory.date ? humorHistory.date.format(DATE_TIME_FORMAT) : null,
      profile: humorHistory.profile,
    });

    this.profilesSharedCollection = this.profileService.addProfileToCollectionIfMissing(
      this.profilesSharedCollection,
      humorHistory.profile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.profileService
      .query()
      .pipe(map((res: HttpResponse<IProfile[]>) => res.body ?? []))
      .pipe(
        map((profiles: IProfile[]) => this.profileService.addProfileToCollectionIfMissing(profiles, this.editForm.get('profile')!.value))
      )
      .subscribe((profiles: IProfile[]) => (this.profilesSharedCollection = profiles));
  }

  protected createFromForm(): IHumorHistory {
    return {
      ...new HumorHistory(),
      id: this.editForm.get(['id'])!.value,
      humor: this.editForm.get(['humor'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      profile: this.editForm.get(['profile'])!.value,
    };
  }
}
