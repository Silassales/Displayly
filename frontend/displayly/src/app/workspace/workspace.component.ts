import { Component, OnInit } from '@angular/core';
import {WorkspaceService} from '../workspace.service';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router'
import {CreateWorkspaceModalComponent} from '../create-workspace-modal/create-workspace-modal.component';

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

  constructor(private workspaceService: WorkspaceService, private dialog: MatDialog, private router: Router) { }

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
    this.workspaceService.getWorkspaces().subscribe( workspaces => {
      this.workspaces = workspaces;
    }, err => {
      // TODO: Add some error handling
    }, () => this.loading = false);
  }

  elementClicked(workspace: number) {
    this.router.navigate(['dashboard/workspaceWithId'], {queryParams: {workspaceId: workspace}});
  }

  addElementClicked() {
    const dialogRef = this.dialog.open(CreateWorkspaceModalComponent, {
      width: 'auto'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getWorkspaces();
    });
  }

}
