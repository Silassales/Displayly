import {Component, OnInit} from '@angular/core';
import {ScenesService} from '../scenes.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {CreateSceneModalComponent} from '../create-scene-modal/create-scene-modal.component';
import {AddSlidesModalComponent} from '../add-slides-modal/add-slides-modal.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

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
  selected: number;


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
    this.selected = null;
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

  elementClicked(scene) {
    if (this.selected === scene) {
      this.selected = null;
    } else {
      this.selected = scene;
    }
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

  editScene() {
    const dialogRef = this.dialog.open(AddSlidesModalComponent, {
      width: '80%',
      data: {
        'workspaceId': this.workspaceId,
        'sceneId': this.selected['id'].toString(),
        'slides': this.selected['slides'],
        'sceneName': this.selected['name']
      }
    });
    dialogRef.afterClosed().subscribe(() => this.getScenes());
  }

  deleteScene() {
    this.dialog.open(ConfirmDialogComponent, {
      width: 'auto',
      data: {
        question: `Are you sure you want to delete this scene?`,
        yes: () => {
          this.error = '';
          this.scenesService.deleteScene(this.workspaceId, this.selected['id']).subscribe(
            res => this.getScenes(),
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
}
