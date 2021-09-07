import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IBreastFeed, BreastFeed } from '../breast-feed.model';
import { BreastFeedService } from '../service/breast-feed.service';
import { IProfile } from 'app/entities/profile/profile/profile.model';
import { ProfileService } from 'app/entities/profile/profile/service/profile.service';

@Component({
  selector: 'jhi-breast-feed-update',
  templateUrl: './breast-feed-update.component.html',
})
export class BreastFeedUpdateComponent implements OnInit {
  isSaving = false;

  profilesSharedCollection: IProfile[] = [];

  editForm = this.fb.group({
    id: [],
    start: [],
    end: [],
    pain: [],
    profile: [],
  });

  constructor(
    protected breastFeedService: BreastFeedService,
    protected profileService: ProfileService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ breastFeed }) => {
      if (breastFeed.id === undefined) {
        const today = dayjs().startOf('day');
        breastFeed.start = today;
        breastFeed.end = today;
      }

      this.updateForm(breastFeed);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const breastFeed = this.createFromForm();
    if (breastFeed.id !== undefined) {
      this.subscribeToSaveResponse(this.breastFeedService.update(breastFeed));
    } else {
      this.subscribeToSaveResponse(this.breastFeedService.create(breastFeed));
    }
  }

  trackProfileById(index: number, item: IProfile): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBreastFeed>>): void {
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

  protected updateForm(breastFeed: IBreastFeed): void {
    this.editForm.patchValue({
      id: breastFeed.id,
      start: breastFeed.start ? breastFeed.start.format(DATE_TIME_FORMAT) : null,
      end: breastFeed.end ? breastFeed.end.format(DATE_TIME_FORMAT) : null,
      pain: breastFeed.pain,
      profile: breastFeed.profile,
    });

    this.profilesSharedCollection = this.profileService.addProfileToCollectionIfMissing(this.profilesSharedCollection, breastFeed.profile);
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

  protected createFromForm(): IBreastFeed {
    return {
      ...new BreastFeed(),
      id: this.editForm.get(['id'])!.value,
      start: this.editForm.get(['start'])!.value ? dayjs(this.editForm.get(['start'])!.value, DATE_TIME_FORMAT) : undefined,
      end: this.editForm.get(['end'])!.value ? dayjs(this.editForm.get(['end'])!.value, DATE_TIME_FORMAT) : undefined,
      pain: this.editForm.get(['pain'])!.value,
      profile: this.editForm.get(['profile'])!.value,
    };
  }
}
