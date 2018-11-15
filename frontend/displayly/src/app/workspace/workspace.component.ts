import { Component, OnInit } from '@angular/core';
import {SceneserviceService} from '../sceneservice.service';
import {WorkspaceserviceService} from '../workspaceservice.service';

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

  constructor(private workspaceService: WorkspaceserviceService) { }

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

  getWorkspaces(){
    this.workspaceService.getWorkspaces().subscribe( workspaces => this.workspaces = workspaces);
  }

  elementClicked(workspace: number) {
    this.clicked = workspace;
  }

  addElementClicked() {
    this.clicked = -99999;
  }

}
