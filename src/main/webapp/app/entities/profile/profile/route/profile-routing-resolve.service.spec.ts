jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProfile, Profile } from '../profile.model';
import { ProfileService } from '../service/profile.service';

import { ProfileRoutingResolveService } from './profile-routing-resolve.service';

describe('Service Tests', () => {
  describe('Profile routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ProfileRoutingResolveService;
    let service: ProfileService;
    let resultProfile: IProfile | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ProfileRoutingResolveService);
      service = TestBed.inject(ProfileService);
      resultProfile = undefined;
    });

    describe('resolve', () => {
      it('should return IProfile returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProfile = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProfile).toEqual({ id: 123 });
      });

      it('should return new IProfile if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProfile = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultProfile).toEqual(new Profile());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Profile })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProfile = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProfile).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
