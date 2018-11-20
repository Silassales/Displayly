import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSceneModalComponent } from './add-scene-modal.component';

describe('AddSceneModalComponent', () => {
  let component: AddSceneModalComponent;
  let fixture: ComponentFixture<AddSceneModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSceneModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSceneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
