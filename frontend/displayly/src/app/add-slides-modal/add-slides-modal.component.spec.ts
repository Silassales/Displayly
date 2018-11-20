import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSlidesModalComponent } from './add-slides-modal.component';

describe('AddSlidesModalComponent', () => {
  let component: AddSlidesModalComponent;
  let fixture: ComponentFixture<AddSlidesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSlidesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSlidesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
