import {Component, OnInit} from '@angular/core';
import {WorkspaceService} from '../workspace.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';
import {CreateWorkspaceModalComponent} from '../create-workspace-modal/create-workspace-modal.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {AddUserToWorkspaceComponent} from '../add-user-to-workspace/add-user-to-workspace.component';

@Component({
  selector: 'app-workspace-component',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})

export class WorkspaceComponent implements OnInit {

  adjustedCols: number;
  adjustedColsList = {
    xl: 6,
    md: 3,
    xs: 1
  };
  workspaces: Object;
  loading = true;
  selected: number;
  error: string;

  constructor(private workspaceService: WorkspaceService, private dialog: MatDialog, private router: Router) {
  }

  ngOnInit(): void {
    if (window.innerWidth >= 1000) {
      this.adjustedCols = this.adjustedColsList.xl;
    } else if (window.innerWidth >= 500) {
      this.adjustedCols = this.adjustedColsList.md;
    } else {
      this.adjustedCols = this.adjustedColsList.xs;
    }
    this.getWorkspaces();
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

  getWorkspaces() {
    this.loading = true;
    this.selected = null;
    this.workspaceService.getWorkspaces().subscribe(workspaces => {
      this.workspaces = workspaces;
    }, err => {
      this.error = err['error']['error'];
    }, () => this.loading = false);
  }

  elementClicked(workspace: number) {
    if (this.selected === workspace) {
      this.selected = null;
    } else {
      this.selected = workspace;
    }
  }

  addElementClicked() {
    const dialogRef = this.dialog.open(CreateWorkspaceModalComponent, {
      width: 'auto'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getWorkspaces();
    });
  }

  enterWorkspace() {
    this.router.navigate(['dashboard/workspaceWithId'], {queryParams: {workspaceId: this.selected}});
  }

  deleteWorkspace() {
    this.dialog.open(ConfirmDialogComponent, {
      width: 'auto',
      data: {
        question: `Are you sure you want to delete this workspace?`,
        yes: () => {
          this.error = '';
          this.workspaceService.deleteWorkspace(this.selected).subscribe(
            res => this.getWorkspaces(),
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

  openWorkspaceHelpDialog() {
    const dialogRef = this.dialog.open(WorkspaceHelpDialogComponent, {
      width: '25%'
    });
  }

  addUserToWorkspace() {
    this.dialog.open(AddUserToWorkspaceComponent, {
      width: 'auto',
      data: {
        workspaceId: this.selected,
      }
    });
  }
}

@Component({
  selector: 'app-workspace-help-dialog',
  templateUrl: 'workspace-help-dialog.html'
})
export class WorkspaceHelpDialogComponent {
  constructor(public dialogRef: MatDialogRef<WorkspaceHelpDialogComponent>) { }

  closeDialog() {
    this.dialogRef.close();
  }
}
