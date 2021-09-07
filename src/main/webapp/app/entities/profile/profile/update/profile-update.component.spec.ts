jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProfileService } from '../service/profile.service';
import { IProfile, Profile } from '../profile.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ProfileUpdateComponent } from './profile-update.component';

describe('Component Tests', () => {
  describe('Profile Management Update Component', () => {
    let comp: ProfileUpdateComponent;
    let fixture: ComponentFixture<ProfileUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let profileService: ProfileService;
    let userService: UserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProfileUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProfileUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProfileUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      profileService = TestBed.inject(ProfileService);
      userService = TestBed.inject(UserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const profile: IProfile = { id: 456 };
        const user: IUser = { id: 'd9a3d370-3bf7-44ce-b2fd-93adefb88af4' };
        profile.user = user;

        const userCollection: IUser[] = [{ id: '753c9be2-d440-4ecd-a37b-7bcc28963a1b' }];
        jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ profile });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const profile: IProfile = { id: 456 };
        const user: IUser = { id: 'acd8b8d3-7a4f-447a-9452-818fac312899' };
        profile.user = user;

        activatedRoute.data = of({ profile });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(profile));
        expect(comp.usersSharedCollection).toContain(user);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Profile>>();
        const profile = { id: 123 };
        jest.spyOn(profileService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ profile });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: profile }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(profileService.update).toHaveBeenCalledWith(profile);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Profile>>();
        const profile = new Profile();
        jest.spyOn(profileService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ profile });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: profile }));
        saveSubject.complete();

        // THEN
        expect(profileService.create).toHaveBeenCalledWith(profile);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Profile>>();
        const profile = { id: 123 };
        jest.spyOn(profileService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ profile });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(profileService.update).toHaveBeenCalledWith(profile);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
