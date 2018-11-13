import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaylyToolbarWrapperComponent } from './displayly-toolbar-wrapper.component';

describe('DisplaylyToolbarWrapperComponent', () => {
  let component: DisplaylyToolbarWrapperComponent;
  let fixture: ComponentFixture<DisplaylyToolbarWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaylyToolbarWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaylyToolbarWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
