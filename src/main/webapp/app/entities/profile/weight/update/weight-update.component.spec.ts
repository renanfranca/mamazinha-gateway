jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { WeightService } from '../service/weight.service';
import { IWeight, Weight } from '../weight.model';
import { IProfile } from 'app/entities/profile/profile/profile.model';
import { ProfileService } from 'app/entities/profile/profile/service/profile.service';

import { WeightUpdateComponent } from './weight-update.component';

describe('Component Tests', () => {
  describe('Weight Management Update Component', () => {
    let comp: WeightUpdateComponent;
    let fixture: ComponentFixture<WeightUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let weightService: WeightService;
    let profileService: ProfileService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [WeightUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(WeightUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WeightUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      weightService = TestBed.inject(WeightService);
      profileService = TestBed.inject(ProfileService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Profile query and add missing value', () => {
        const weight: IWeight = { id: 456 };
        const profile: IProfile = { id: 92547 };
        weight.profile = profile;

        const profileCollection: IProfile[] = [{ id: 99506 }];
        jest.spyOn(profileService, 'query').mockReturnValue(of(new HttpResponse({ body: profileCollection })));
        const additionalProfiles = [profile];
        const expectedCollection: IProfile[] = [...additionalProfiles, ...profileCollection];
        jest.spyOn(profileService, 'addProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ weight });
        comp.ngOnInit();

        expect(profileService.query).toHaveBeenCalled();
        expect(profileService.addProfileToCollectionIfMissing).toHaveBeenCalledWith(profileCollection, ...additionalProfiles);
        expect(comp.profilesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const weight: IWeight = { id: 456 };
        const profile: IProfile = { id: 43028 };
        weight.profile = profile;

        activatedRoute.data = of({ weight });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(weight));
        expect(comp.profilesSharedCollection).toContain(profile);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Weight>>();
        const weight = { id: 123 };
        jest.spyOn(weightService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ weight });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: weight }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(weightService.update).toHaveBeenCalledWith(weight);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Weight>>();
        const weight = new Weight();
        jest.spyOn(weightService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ weight });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: weight }));
        saveSubject.complete();

        // THEN
        expect(weightService.create).toHaveBeenCalledWith(weight);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Weight>>();
        const weight = { id: 123 };
        jest.spyOn(weightService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ weight });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(weightService.update).toHaveBeenCalledWith(weight);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackProfileById', () => {
        it('Should return tracked Profile primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProfileById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
