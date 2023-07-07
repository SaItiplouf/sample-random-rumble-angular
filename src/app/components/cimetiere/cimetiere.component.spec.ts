import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CimetiereComponent } from './cimetiere.component';

describe('CimetiereComponent', () => {
  let component: CimetiereComponent;
  let fixture: ComponentFixture<CimetiereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CimetiereComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CimetiereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
