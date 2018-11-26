import {Component, OnInit} from '@angular/core';
import {DisplaysService} from '../display.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material';
import {CreateDisplayModalComponent} from '../create-display-modal/create-display-modal.component';
import {AddSceneModalComponent} from '../add-scene-modal/add-scene-modal.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {WorkspaceHelpDialogComponent} from '../workspace/workspace.component';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  adjustedCols: number;
  adjustedColsList = {
    xl: 6,
    md: 3,
    xs: 1
  };
  displays = [];
  workspaceId: string; // Stores the workspaceId id from the path
  loading: boolean;
  selected: object;
  error: string;

  constructor(private route: ActivatedRoute, private displayService: DisplaysService, private dialog: MatDialog, private router: Router) {
  }

  ngOnInit(): void {
    if (window.innerWidth >= 1000) {
      this.adjustedCols = this.adjustedColsList.xl;
    } else if (window.innerWidth >= 500) {
      this.adjustedCols = this.adjustedColsList.md;
    } else {
      this.adjustedCols = this.adjustedColsList.xs;
    }
    const id: number = +this.route.snapshot.queryParamMap.get('workspaceId');
    this.workspaceId = id.toString();
    this.getDisplays();
  }

  onResize(event) {
    if (event.target.innerWidth >= 1000) {
      this.adjustedCols = this.adjustedColsList.xl;
    } else if (event.target.innerWidth >= 500) {
      this.adjustedCols = this.adjustedColsList.md;
    } else {
      this.adjustedCols = this.adjustedColsList.xs;
    }
  }

  getDisplays() {
    this.loading = true;
    this.selected = null;
    this.displayService.getDisplays(this.workspaceId).subscribe(
      displays => {
        this.displays = displays; // Set the scenes
      },
      err => {
        // TODO handle error here
      }, () => this.loading = false
    );
  }

  addElementClicked() {
    const dialogRef = this.dialog.open(CreateDisplayModalComponent, {
      width: 'auto',
      data: {
        workspaceId: this.workspaceId
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getDisplays(); // Refresh the scenes after the dialog has closed
    });
  }

  elementClicked(display) {
    if (this.selected === display) {
      this.selected = null;
    } else {
      this.selected = display;
    }
  }

  editDisplay() {
    const dialogRef = this.dialog.open(AddSceneModalComponent, {
      width: '80%',
      data: {
        'workspaceId': this.workspaceId,
        'displayId': this.selected['id'].toString(),
        'selectedScene': this.selected['sceneId'],
        'displayName': this.selected['name']
      }
    });
    dialogRef.afterClosed().subscribe(() => this.getDisplays());
  }

  showDisplay() {
    window.open(`/showDisplay?displayId=${this.selected['id']}&workspaceId=${this.workspaceId}`, '_blank');
  }

  deleteDisplay() {
    this.dialog.open(ConfirmDialogComponent, {
      width: 'auto',
      data: {
        question: `Are you sure you want to delete this display?`,
        yes: () => {
          this.error = '';
          this.displayService.deleteDisplay(this.workspaceId, this.selected['id']).subscribe(
            res => this.getDisplays(),
            err => {
              this.error = err['error']['error'];
              console.log(err);
            }
          );
        },
        no: () => {
        }
      }
    });
  }

  openDisplayHelpDialog() {
    const dialogRef = this.dialog.open(DisplayHelpDialogComponent, {
      width: '25%'
    });
  }
}

@Component({
  selector: 'app-display-help-dialog',
  templateUrl: 'display-help-dialog.html'
})
export class DisplayHelpDialogComponent {
  constructor(public dialogRef: MatDialogRef<DisplayHelpDialogComponent>) { }

  closeDialog() {
    this.dialogRef.close();
  }
}
