import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSceneModalComponent } from './create-scene-modal.component';

describe('CreateSceneModalComponent', () => {
  let component: CreateSceneModalComponent;
  let fixture: ComponentFixture<CreateSceneModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSceneModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSceneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
