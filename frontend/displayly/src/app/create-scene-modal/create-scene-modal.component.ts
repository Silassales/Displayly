import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {ScenesService} from '../scenes.service';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';

@Component({
  selector: 'app-create-scene-modal',
  templateUrl: './create-scene-modal.component.html',
  styleUrls: ['./create-scene-modal.component.css']
})
export class CreateSceneModalComponent implements OnInit {

  sceneValidator = new FormControl('', [Validators.required]);
  loading = false;
  error = '';
  workspaceId = '';

  constructor(private sceneService: ScenesService, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  ngOnInit() {
    this.workspaceId = this.data['workspaceId']; // Grab the workspace id from the parent component
  }

  submit() {
    this.sceneService.createScene(this.workspaceId, this.sceneValidator.value).subscribe(response => {
      this.dialog.closeAll();
    }, err => {
      this.loading = false;
      // If authentication was not successful, display the error. If no error was provided, show a generic error
      this.error = (err.error.error) ? err.error.error : 'There was an error with the system, try again later';
    });
  }

  buttonDisabled() {
    return this.sceneValidator.hasError('required') || this.loading;
  }
}
