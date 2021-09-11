import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IWeight, Weight } from '../weight.model';
import { WeightService } from '../service/weight.service';
import { IBabyProfile } from 'app/entities/babyprofile/baby-profile/baby-profile.model';
import { BabyProfileService } from 'app/entities/babyprofile/baby-profile/service/baby-profile.service';

@Component({
  selector: 'jhi-weight-update',
  templateUrl: './weight-update.component.html',
})
export class WeightUpdateComponent implements OnInit {
  isSaving = false;

  babyProfilesSharedCollection: IBabyProfile[] = [];

  editForm = this.fb.group({
    id: [],
    value: [],
    date: [],
    idealWight: [],
    babyProfile: [],
  });

  constructor(
    protected weightService: WeightService,
    protected babyProfileService: BabyProfileService,
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

  trackBabyProfileById(index: number, item: IBabyProfile): number {
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
      babyProfile: weight.babyProfile,
    });

    this.babyProfilesSharedCollection = this.babyProfileService.addBabyProfileToCollectionIfMissing(
      this.babyProfilesSharedCollection,
      weight.babyProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.babyProfileService
      .query()
      .pipe(map((res: HttpResponse<IBabyProfile[]>) => res.body ?? []))
      .pipe(
        map((babyProfiles: IBabyProfile[]) =>
          this.babyProfileService.addBabyProfileToCollectionIfMissing(babyProfiles, this.editForm.get('babyProfile')!.value)
        )
      )
      .subscribe((babyProfiles: IBabyProfile[]) => (this.babyProfilesSharedCollection = babyProfiles));
  }

  protected createFromForm(): IWeight {
    return {
      ...new Weight(),
      id: this.editForm.get(['id'])!.value,
      value: this.editForm.get(['value'])!.value,
      date: this.editForm.get(['date'])!.value,
      idealWight: this.editForm.get(['idealWight'])!.value,
      babyProfile: this.editForm.get(['babyProfile'])!.value,
    };
  }
}
