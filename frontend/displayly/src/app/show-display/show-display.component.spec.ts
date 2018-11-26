import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDisplayComponent } from './show-display.component';

describe('ShowDisplayComponent', () => {
  let component: ShowDisplayComponent;
  let fixture: ComponentFixture<ShowDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
