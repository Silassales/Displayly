import { Component, OnInit } from '@angular/core';
import {WorkspaceserviceService} from '../workspaceservice.service';
import {MatDialog} from '@angular/material';
import {CreateWorkspaceModalComponent} from '../create-workspace-modal/create-workspace-modal.component';

@Component({
  selector: 'app-workspace-component',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  clicked: number;
  adjustedCols: number;
  adjustedColsList = {
    xl: 10,
    md: 5,
    xs: 1
  };
  workspaces: Object;
  loading = true;

  constructor(private workspaceService: WorkspaceserviceService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.clicked = 0;
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
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }

  elementClicked(workspace: number) {
    this.clicked = workspace;
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
