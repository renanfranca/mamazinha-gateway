jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IWeight, Weight } from '../weight.model';
import { WeightService } from '../service/weight.service';

import { WeightRoutingResolveService } from './weight-routing-resolve.service';

describe('Service Tests', () => {
  describe('Weight routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: WeightRoutingResolveService;
    let service: WeightService;
    let resultWeight: IWeight | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(WeightRoutingResolveService);
      service = TestBed.inject(WeightService);
      resultWeight = undefined;
    });

    describe('resolve', () => {
      it('should return IWeight returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultWeight = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultWeight).toEqual({ id: 123 });
      });

      it('should return new IWeight if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultWeight = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultWeight).toEqual(new Weight());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Weight })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultWeight = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultWeight).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
