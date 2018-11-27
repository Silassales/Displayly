import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {DisplaysService} from '../display.service';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';

@Component({
  selector: 'app-create-display-modal',
  templateUrl: './create-display-modal.component.html',
  styleUrls: ['./create-display-modal.component.css']
})
export class CreateDisplayModalComponent implements OnInit {

  displayValidator = new FormControl('', [Validators.required]);
  loading = false;
  error = '';
  workspaceId = '';

  constructor(private displayService: DisplaysService, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  ngOnInit() {
    this.workspaceId = this.data['workspaceId'];
  }

  submit() {
    this.displayService.createDisplay(this.workspaceId, this.displayValidator.value).subscribe(response => {
      this.dialog.closeAll();
    }, err => {
      this.loading = false;

      this.error = (err.error.error) ? err.error.error : 'There was an error with the system, try again later';

    });
  }

  buttonDisabled() {
    return this.displayValidator.hasError('required') || this.loading;
  }

}
