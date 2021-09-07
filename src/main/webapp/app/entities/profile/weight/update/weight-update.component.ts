import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IWeight, Weight } from '../weight.model';
import { WeightService } from '../service/weight.service';
import { IProfile } from 'app/entities/profile/profile/profile.model';
import { ProfileService } from 'app/entities/profile/profile/service/profile.service';

@Component({
  selector: 'jhi-weight-update',
  templateUrl: './weight-update.component.html',
})
export class WeightUpdateComponent implements OnInit {
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
    protected weightService: WeightService,
    protected profileService: ProfileService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ weight }) => {
      this.updateForm(weight);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const weight = this.createFromForm();
    if (weight.id !== undefined) {
      this.subscribeToSaveResponse(this.weightService.update(weight));
    } else {
      this.subscribeToSaveResponse(this.weightService.create(weight));
    }
  }

  trackProfileById(index: number, item: IProfile): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWeight>>): void {
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

  protected updateForm(weight: IWeight): void {
    this.editForm.patchValue({
      id: weight.id,
      value: weight.value,
      date: weight.date,
      idealWight: weight.idealWight,
      profile: weight.profile,
    });

    this.profilesSharedCollection = this.profileService.addProfileToCollectionIfMissing(this.profilesSharedCollection, weight.profile);
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

  protected createFromForm(): IWeight {
    return {
      ...new Weight(),
      id: this.editForm.get(['id'])!.value,
      value: this.editForm.get(['value'])!.value,
      date: this.editForm.get(['date'])!.value,
      idealWight: this.editForm.get(['idealWight'])!.value,
      profile: this.editForm.get(['profile'])!.value,
    };
  }
}
