import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinpageComponent } from './winpage.component';

describe('WinpageComponent', () => {
  let component: WinpageComponent;
  let fixture: ComponentFixture<WinpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WinpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
