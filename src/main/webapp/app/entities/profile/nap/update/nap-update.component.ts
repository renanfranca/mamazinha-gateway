import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { INap, Nap } from '../nap.model';
import { NapService } from '../service/nap.service';
import { IProfile } from 'app/entities/profile/profile/profile.model';
import { ProfileService } from 'app/entities/profile/profile/service/profile.service';

@Component({
  selector: 'jhi-nap-update',
  templateUrl: './nap-update.component.html',
})
export class NapUpdateComponent implements OnInit {
  isSaving = false;

  profilesSharedCollection: IProfile[] = [];

  editForm = this.fb.group({
    id: [],
    start: [],
    end: [],
    humor: [],
    place: [],
    profile: [],
  });

  constructor(
    protected napService: NapService,
    protected profileService: ProfileService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ nap }) => {
      if (nap.id === undefined) {
        const today = dayjs().startOf('day');
        nap.start = today;
        nap.end = today;
      }

      this.updateForm(nap);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const nap = this.createFromForm();
    if (nap.id !== undefined) {
      this.subscribeToSaveResponse(this.napService.update(nap));
    } else {
      this.subscribeToSaveResponse(this.napService.create(nap));
    }
  }

  trackProfileById(index: number, item: IProfile): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INap>>): void {
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

  protected updateForm(nap: INap): void {
    this.editForm.patchValue({
      id: nap.id,
      start: nap.start ? nap.start.format(DATE_TIME_FORMAT) : null,
      end: nap.end ? nap.end.format(DATE_TIME_FORMAT) : null,
      humor: nap.humor,
      place: nap.place,
      profile: nap.profile,
    });

    this.profilesSharedCollection = this.profileService.addProfileToCollectionIfMissing(this.profilesSharedCollection, nap.profile);
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

  protected createFromForm(): INap {
    return {
      ...new Nap(),
      id: this.editForm.get(['id'])!.value,
      start: this.editForm.get(['start'])!.value ? dayjs(this.editForm.get(['start'])!.value, DATE_TIME_FORMAT) : undefined,
      end: this.editForm.get(['end'])!.value ? dayjs(this.editForm.get(['end'])!.value, DATE_TIME_FORMAT) : undefined,
      humor: this.editForm.get(['humor'])!.value,
      place: this.editForm.get(['place'])!.value,
      profile: this.editForm.get(['profile'])!.value,
    };
  }
}
