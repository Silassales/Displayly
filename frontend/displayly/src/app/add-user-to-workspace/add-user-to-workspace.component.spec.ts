import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserToWorkspaceComponent } from './add-user-to-workspace.component';

describe('AddUserToWorkspaceComponent', () => {
  let component: AddUserToWorkspaceComponent;
  let fixture: ComponentFixture<AddUserToWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserToWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserToWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
