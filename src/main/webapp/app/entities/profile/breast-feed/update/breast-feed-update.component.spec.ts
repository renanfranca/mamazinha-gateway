jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BreastFeedService } from '../service/breast-feed.service';
import { IBreastFeed, BreastFeed } from '../breast-feed.model';
import { IProfile } from 'app/entities/profile/profile/profile.model';
import { ProfileService } from 'app/entities/profile/profile/service/profile.service';

import { BreastFeedUpdateComponent } from './breast-feed-update.component';

describe('Component Tests', () => {
  describe('BreastFeed Management Update Component', () => {
    let comp: BreastFeedUpdateComponent;
    let fixture: ComponentFixture<BreastFeedUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let breastFeedService: BreastFeedService;
    let profileService: ProfileService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BreastFeedUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BreastFeedUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BreastFeedUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      breastFeedService = TestBed.inject(BreastFeedService);
      profileService = TestBed.inject(ProfileService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Profile query and add missing value', () => {
        const breastFeed: IBreastFeed = { id: 456 };
        const profile: IProfile = { id: 9166 };
        breastFeed.profile = profile;

        const profileCollection: IProfile[] = [{ id: 59324 }];
        jest.spyOn(profileService, 'query').mockReturnValue(of(new HttpResponse({ body: profileCollection })));
        const additionalProfiles = [profile];
        const expectedCollection: IProfile[] = [...additionalProfiles, ...profileCollection];
        jest.spyOn(profileService, 'addProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ breastFeed });
        comp.ngOnInit();

        expect(profileService.query).toHaveBeenCalled();
        expect(profileService.addProfileToCollectionIfMissing).toHaveBeenCalledWith(profileCollection, ...additionalProfiles);
        expect(comp.profilesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const breastFeed: IBreastFeed = { id: 456 };
        const profile: IProfile = { id: 29427 };
        breastFeed.profile = profile;

        activatedRoute.data = of({ breastFeed });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(breastFeed));
        expect(comp.profilesSharedCollection).toContain(profile);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<BreastFeed>>();
        const breastFeed = { id: 123 };
        jest.spyOn(breastFeedService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ breastFeed });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: breastFeed }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(breastFeedService.update).toHaveBeenCalledWith(breastFeed);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<BreastFeed>>();
        const breastFeed = new BreastFeed();
        jest.spyOn(breastFeedService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ breastFeed });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: breastFeed }));
        saveSubject.complete();

        // THEN
        expect(breastFeedService.create).toHaveBeenCalledWith(breastFeed);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<BreastFeed>>();
        const breastFeed = { id: 123 };
        jest.spyOn(breastFeedService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ breastFeed });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(breastFeedService.update).toHaveBeenCalledWith(breastFeed);
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
