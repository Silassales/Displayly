import {Component, OnInit} from '@angular/core';
import {ScenesService} from '../scenes.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {CreateSceneModalComponent} from '../create-scene-modal/create-scene-modal.component';
import {AddSlidesModalComponent} from '../add-slides-modal/add-slides-modal.component';

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
  workspaceId: string; // Stores the workspaceId id from the path
  loading: boolean;
  error: string;


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
    const id: number = +this.route.snapshot.queryParamMap.get('workspaceId');
    this.workspaceId = id.toString();
    // this.workspaceId = this.route.snapshot.paramMap.get('workspaceId');
    // if (!this.workspaceId) { // If we couldn't grab the workspaceId id from the url, redirect to the dashboard
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
    this.error = null;
    this.scenesService.getScenes(this.workspaceId).subscribe(
      scenes => {
        this.scenes = scenes; // Set the scenes
        this.loading = false;
      },
      err => {
        this.error = err['error']['error'];
        // TODO handle error here
        console.log(err);
        this.loading = false;
      }, () => this.loading = false
    );
  }

  elementClicked(scene: number) {
    const dialogRef = this.dialog.open(AddSlidesModalComponent, {
      width: '80%',
      data: {
        'workspaceId': this.workspaceId,
        'sceneId': scene['id'].toString(),
        'slides': scene['slides'],
        'sceneName': scene['name']
      }
    });
    dialogRef.afterClosed().subscribe(() => this.getScenes());
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
