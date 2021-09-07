import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IHeight, Height } from '../height.model';
import { HeightService } from '../service/height.service';
import { IProfile } from 'app/entities/profile/profile/profile.model';
import { ProfileService } from 'app/entities/profile/profile/service/profile.service';

@Component({
  selector: 'jhi-height-update',
  templateUrl: './height-update.component.html',
})
export class HeightUpdateComponent implements OnInit {
  isSaving = false;

  profilesSharedCollection: IProfile[] = [];

  editForm = this.fb.group({
    id: [],
    value: [],
    date: [],
    idealWight: [],
    profile: [],
  });

  constructor(
    protected heightService: HeightService,
    protected profileService: ProfileService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ height }) => {
      this.updateForm(height);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const height = this.createFromForm();
    if (height.id !== undefined) {
      this.subscribeToSaveResponse(this.heightService.update(height));
    } else {
      this.subscribeToSaveResponse(this.heightService.create(height));
    }
  }

  trackProfileById(index: number, item: IProfile): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHeight>>): void {
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

  protected updateForm(height: IHeight): void {
    this.editForm.patchValue({
      id: height.id,
      value: height.value,
      date: height.date,
      idealWight: height.idealWight,
      profile: height.profile,
    });

    this.profilesSharedCollection = this.profileService.addProfileToCollectionIfMissing(this.profilesSharedCollection, height.profile);
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

  protected createFromForm(): IHeight {
    return {
      ...new Height(),
      id: this.editForm.get(['id'])!.value,
      value: this.editForm.get(['value'])!.value,
      date: this.editForm.get(['date'])!.value,
      idealWight: this.editForm.get(['idealWight'])!.value,
      profile: this.editForm.get(['profile'])!.value,
    };
  }
}
