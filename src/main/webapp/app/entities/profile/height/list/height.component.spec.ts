import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { HeightService } from '../service/height.service';

import { HeightComponent } from './height.component';

describe('Component Tests', () => {
  describe('Height Management Component', () => {
    let comp: HeightComponent;
    let fixture: ComponentFixture<HeightComponent>;
    let service: HeightService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [HeightComponent],
      })
        .overrideTemplate(HeightComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(HeightComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(HeightService);

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
      expect(comp.heights?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
