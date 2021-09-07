jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { HeightService } from '../service/height.service';
import { IHeight, Height } from '../height.model';
import { IProfile } from 'app/entities/profile/profile/profile.model';
import { ProfileService } from 'app/entities/profile/profile/service/profile.service';

import { HeightUpdateComponent } from './height-update.component';

describe('Component Tests', () => {
  describe('Height Management Update Component', () => {
    let comp: HeightUpdateComponent;
    let fixture: ComponentFixture<HeightUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let heightService: HeightService;
    let profileService: ProfileService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [HeightUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(HeightUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(HeightUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      heightService = TestBed.inject(HeightService);
      profileService = TestBed.inject(ProfileService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Profile query and add missing value', () => {
        const height: IHeight = { id: 456 };
        const profile: IProfile = { id: 12988 };
        height.profile = profile;

        const profileCollection: IProfile[] = [{ id: 84581 }];
        jest.spyOn(profileService, 'query').mockReturnValue(of(new HttpResponse({ body: profileCollection })));
        const additionalProfiles = [profile];
        const expectedCollection: IProfile[] = [...additionalProfiles, ...profileCollection];
        jest.spyOn(profileService, 'addProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ height });
        comp.ngOnInit();

        expect(profileService.query).toHaveBeenCalled();
        expect(profileService.addProfileToCollectionIfMissing).toHaveBeenCalledWith(profileCollection, ...additionalProfiles);
        expect(comp.profilesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const height: IHeight = { id: 456 };
        const profile: IProfile = { id: 41070 };
        height.profile = profile;

        activatedRoute.data = of({ height });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(height));
        expect(comp.profilesSharedCollection).toContain(profile);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Height>>();
        const height = { id: 123 };
        jest.spyOn(heightService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ height });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: height }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(heightService.update).toHaveBeenCalledWith(height);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Height>>();
        const height = new Height();
        jest.spyOn(heightService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ height });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: height }));
        saveSubject.complete();

        // THEN
        expect(heightService.create).toHaveBeenCalledWith(height);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Height>>();
        const height = { id: 123 };
        jest.spyOn(heightService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ height });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(heightService.update).toHaveBeenCalledWith(height);
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
