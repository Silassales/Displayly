import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import {WorkspaceService} from '../workspace.service';

@Component({
  selector: 'app-create-workspace-modal',
  templateUrl: './create-workspace-modal.component.html',
  styleUrls: ['./create-workspace-modal.component.css']
})
export class CreateWorkspaceModalComponent {

  workspaceValidator = new FormControl('', [Validators.required]);
  loading = false;
  error = '';

  constructor(private workspaceService: WorkspaceService, private dialog: MatDialog) {
  }

  submit() {
    this.workspaceService.createWorkspace(this.workspaceValidator.value).subscribe(response => {
      this.dialog.closeAll();
    }, err => {
      this.loading = false;
      // If authentication was not successful, display the error. If no error was provided, show a generic error
      this.error = (err.error.error) ? err.error.error : 'There was an error with the system, try again later';
    });
  }

  buttonDisabled() {
    return this.workspaceValidator.hasError('required') || this.loading;
  }


}
