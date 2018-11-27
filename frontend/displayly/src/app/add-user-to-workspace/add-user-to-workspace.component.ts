import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import {AddUserToWorkspaceService} from '../addUserToWorkspaceService';

@Component({
  selector: 'app-add-user-to-workspace',
  templateUrl: './add-user-to-workspace.component.html',
  styleUrls: ['./add-user-to-workspace.component.css']
})
export class AddUserToWorkspaceComponent implements OnInit {

  addUserValidator = new FormControl('', [Validators.required, Validators.email]);
  workspaceId = '';
  error = '';

  ngOnInit() {
    this.workspaceId = this.data['workspaceId']; // Grab the workspaceId id from the parent component
  }

  constructor(private addUserToWorkspaceService: AddUserToWorkspaceService, private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  add() {
    this.addUserToWorkspaceService.addUserToWorkspace(this.workspaceId, this.addUserValidator.value).subscribe(response => {
      this.dialog.closeAll();
    }, err => {
      // If authentication was not successful, display the error. If no error was provided, show a generic error
      this.error = (err.error.error) ? err.error.error : 'There was an error with the system, try again later';
    });
  }

  cancel() {
    this.dialog.closeAll();
  }

  buttonDisabled() {
    return this.addUserValidator.hasError('required');
  }
}
