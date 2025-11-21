import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Getall } from './getall';

describe('Getall', () => {
  let component: Getall;
  let fixture: ComponentFixture<Getall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Getall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Getall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
