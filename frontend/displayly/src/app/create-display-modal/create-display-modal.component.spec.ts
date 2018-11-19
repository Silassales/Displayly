import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDisplayModalComponent } from './create-display-modal.component';

describe('CreateDisplayModalComponent', () => {
  let component: CreateDisplayModalComponent;
  let fixture: ComponentFixture<CreateDisplayModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDisplayModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDisplayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
