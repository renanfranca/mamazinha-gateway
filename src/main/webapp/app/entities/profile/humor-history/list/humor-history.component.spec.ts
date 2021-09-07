import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { HumorHistoryService } from '../service/humor-history.service';

import { HumorHistoryComponent } from './humor-history.component';

describe('Component Tests', () => {
  describe('HumorHistory Management Component', () => {
    let comp: HumorHistoryComponent;
    let fixture: ComponentFixture<HumorHistoryComponent>;
    let service: HumorHistoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [HumorHistoryComponent],
      })
        .overrideTemplate(HumorHistoryComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(HumorHistoryComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(HumorHistoryService);

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
      expect(comp.humorHistories?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
