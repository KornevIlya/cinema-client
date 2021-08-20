import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CinemaClientComponent } from './cinema-client.component';

describe('CinemaClientComponent', () => {
  let component: CinemaClientComponent;
  let fixture: ComponentFixture<CinemaClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CinemaClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CinemaClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
