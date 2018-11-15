import {Component, OnInit} from '@angular/core';
import {ScenesService} from '../scenes.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit {

  clicked: number;
  adjustedCols: number;
  adjustedColsList = {
    xl: 6,
    md: 3,
    xs: 1
  };
  scenes = [];
  workspaceId: string; // Stores the workspace id from the path
  loading: boolean;


  constructor(private route: ActivatedRoute, private scenesService: ScenesService) {
  }

  ngOnInit(): void {
    this.clicked = 0;
    if (window.innerWidth >= 1000) {
      this.adjustedCols = this.adjustedColsList.xl;
    } else if (window.innerWidth >= 500) {
      this.adjustedCols = this.adjustedColsList.md;
    } else {
      this.adjustedCols = this.adjustedColsList.xs;
    }
    // this.workspaceId = this.route.snapshot.paramMap.get('workspaceId');
    this.workspaceId = '29';
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
        console.log(scenes);
        this.scenes = scenes;
      },
      err => {
        // TODO handle error here
      }, () => this.loading = false
    );
    // this.sceneService.getScenes().subscribe( scenes => this.scenes = scenes);
  }

  elementClicked(scene: number) {
    this.clicked = scene;
  }

  addElementClicked() {
    this.clicked = -99999;
  }
}
