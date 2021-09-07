jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { NapService } from '../service/nap.service';
import { INap, Nap } from '../nap.model';
import { IProfile } from 'app/entities/profile/profile/profile.model';
import { ProfileService } from 'app/entities/profile/profile/service/profile.service';

import { NapUpdateComponent } from './nap-update.component';

describe('Component Tests', () => {
  describe('Nap Management Update Component', () => {
    let comp: NapUpdateComponent;
    let fixture: ComponentFixture<NapUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let napService: NapService;
    let profileService: ProfileService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [NapUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(NapUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(NapUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      napService = TestBed.inject(NapService);
      profileService = TestBed.inject(ProfileService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Profile query and add missing value', () => {
        const nap: INap = { id: 456 };
        const profile: IProfile = { id: 44461 };
        nap.profile = profile;

        const profileCollection: IProfile[] = [{ id: 12629 }];
        jest.spyOn(profileService, 'query').mockReturnValue(of(new HttpResponse({ body: profileCollection })));
        const additionalProfiles = [profile];
        const expectedCollection: IProfile[] = [...additionalProfiles, ...profileCollection];
        jest.spyOn(profileService, 'addProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ nap });
        comp.ngOnInit();

        expect(profileService.query).toHaveBeenCalled();
        expect(profileService.addProfileToCollectionIfMissing).toHaveBeenCalledWith(profileCollection, ...additionalProfiles);
        expect(comp.profilesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const nap: INap = { id: 456 };
        const profile: IProfile = { id: 71251 };
        nap.profile = profile;

        activatedRoute.data = of({ nap });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(nap));
        expect(comp.profilesSharedCollection).toContain(profile);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Nap>>();
        const nap = { id: 123 };
        jest.spyOn(napService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ nap });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: nap }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(napService.update).toHaveBeenCalledWith(nap);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Nap>>();
        const nap = new Nap();
        jest.spyOn(napService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ nap });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: nap }));
        saveSubject.complete();

        // THEN
        expect(napService.create).toHaveBeenCalledWith(nap);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Nap>>();
        const nap = { id: 123 };
        jest.spyOn(napService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ nap });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(napService.update).toHaveBeenCalledWith(nap);
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
