import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { NapService } from '../service/nap.service';

import { NapComponent } from './nap.component';

describe('Component Tests', () => {
  describe('Nap Management Component', () => {
    let comp: NapComponent;
    let fixture: ComponentFixture<NapComponent>;
    let service: NapService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [NapComponent],
      })
        .overrideTemplate(NapComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(NapComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(NapService);

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
      expect(comp.naps?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
