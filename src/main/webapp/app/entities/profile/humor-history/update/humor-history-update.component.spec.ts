jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { HumorHistoryService } from '../service/humor-history.service';
import { IHumorHistory, HumorHistory } from '../humor-history.model';
import { IProfile } from 'app/entities/profile/profile/profile.model';
import { ProfileService } from 'app/entities/profile/profile/service/profile.service';

import { HumorHistoryUpdateComponent } from './humor-history-update.component';

describe('Component Tests', () => {
  describe('HumorHistory Management Update Component', () => {
    let comp: HumorHistoryUpdateComponent;
    let fixture: ComponentFixture<HumorHistoryUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let humorHistoryService: HumorHistoryService;
    let profileService: ProfileService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [HumorHistoryUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(HumorHistoryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(HumorHistoryUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      humorHistoryService = TestBed.inject(HumorHistoryService);
      profileService = TestBed.inject(ProfileService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Profile query and add missing value', () => {
        const humorHistory: IHumorHistory = { id: 456 };
        const profile: IProfile = { id: 44429 };
        humorHistory.profile = profile;

        const profileCollection: IProfile[] = [{ id: 69649 }];
        jest.spyOn(profileService, 'query').mockReturnValue(of(new HttpResponse({ body: profileCollection })));
        const additionalProfiles = [profile];
        const expectedCollection: IProfile[] = [...additionalProfiles, ...profileCollection];
        jest.spyOn(profileService, 'addProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ humorHistory });
        comp.ngOnInit();

        expect(profileService.query).toHaveBeenCalled();
        expect(profileService.addProfileToCollectionIfMissing).toHaveBeenCalledWith(profileCollection, ...additionalProfiles);
        expect(comp.profilesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const humorHistory: IHumorHistory = { id: 456 };
        const profile: IProfile = { id: 17256 };
        humorHistory.profile = profile;

        activatedRoute.data = of({ humorHistory });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(humorHistory));
        expect(comp.profilesSharedCollection).toContain(profile);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<HumorHistory>>();
        const humorHistory = { id: 123 };
        jest.spyOn(humorHistoryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ humorHistory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: humorHistory }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(humorHistoryService.update).toHaveBeenCalledWith(humorHistory);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<HumorHistory>>();
        const humorHistory = new HumorHistory();
        jest.spyOn(humorHistoryService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ humorHistory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: humorHistory }));
        saveSubject.complete();

        // THEN
        expect(humorHistoryService.create).toHaveBeenCalledWith(humorHistory);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<HumorHistory>>();
        const humorHistory = { id: 123 };
        jest.spyOn(humorHistoryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ humorHistory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(humorHistoryService.update).toHaveBeenCalledWith(humorHistory);
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
