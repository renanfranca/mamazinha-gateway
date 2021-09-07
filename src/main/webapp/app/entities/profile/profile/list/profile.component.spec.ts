import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProfileService } from '../service/profile.service';

import { ProfileComponent } from './profile.component';

describe('Component Tests', () => {
  describe('Profile Management Component', () => {
    let comp: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;
    let service: ProfileService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProfileComponent],
      })
        .overrideTemplate(ProfileComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProfileComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProfileService);

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
      expect(comp.profiles?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
