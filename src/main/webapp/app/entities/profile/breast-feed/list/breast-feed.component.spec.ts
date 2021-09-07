import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BreastFeedService } from '../service/breast-feed.service';

import { BreastFeedComponent } from './breast-feed.component';

describe('Component Tests', () => {
  describe('BreastFeed Management Component', () => {
    let comp: BreastFeedComponent;
    let fixture: ComponentFixture<BreastFeedComponent>;
    let service: BreastFeedService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BreastFeedComponent],
      })
        .overrideTemplate(BreastFeedComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BreastFeedComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BreastFeedService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.breastFeeds?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
