import {Component, OnInit} from '@angular/core';
import {ScenesService} from '../scenes.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {CreateSceneModalComponent} from '../create-scene-modal/create-scene-modal.component';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit {

  adjustedCols: number;
  adjustedColsList = {
    xl: 6,
    md: 3,
    xs: 1
  };
  scenes = [];
  workspaceId: string; // Stores the workspace id from the path
  loading: boolean;


  constructor(private route: ActivatedRoute, private scenesService: ScenesService, private dialog: MatDialog, private router: Router) {
  }

  ngOnInit(): void {
    if (window.innerWidth >= 1000) {
      this.adjustedCols = this.adjustedColsList.xl;
    } else if (window.innerWidth >= 500) {
      this.adjustedCols = this.adjustedColsList.md;
    } else {
      this.adjustedCols = this.adjustedColsList.xs;
    }
    this.workspaceId = '61';
    // this.workspaceId = this.route.snapshot.paramMap.get('workspaceId');
    // if (!this.workspaceId) { // If we couldn't grab the workspace id from the url, redirect to the dashboard
    //   this.router.navigate(['dashboard']);
    //   return;
    // }
    this.getScenes();
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

  getScenes() {
    this.loading = true;
    this.scenesService.getScenes(this.workspaceId).subscribe(
      scenes => {
        this.scenes = scenes; // Set the scenes
      },
      err => {
        // TODO handle error here
      }, () => this.loading = false
    );
    // this.sceneService.getScenes().subscribe( scenes => this.scenes = scenes);
  }

  elementClicked(scene: number) {
    // TODO: Make this go to something
  }

  addElementClicked() {
    const dialogRef = this.dialog.open(CreateSceneModalComponent, {
      width: 'auto',
      data: {
        workspaceId: this.workspaceId
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getScenes(); // Refresh the scenes after the dialog has closed
    });
  }
}
