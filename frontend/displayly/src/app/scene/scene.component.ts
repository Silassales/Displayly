import {Component, OnInit} from '@angular/core';
import {SceneserviceService} from '../sceneservice.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit {

  clicked: number;
  adjustedCols: number;
  adjustedColsList = {
    xl: 10,
    md: 5,
    xs: 1
  };
  scenes = [];
  id: number;



  constructor(private sceneService: SceneserviceService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.queryParamMap.get('workspaceId');
    console.log("Scene: " + this.id);
    this.clicked = 0;
    if (window.innerWidth >= 1000) {
      this.adjustedCols = this.adjustedColsList.xl;
    } else if (window.innerWidth >= 500) {
      this.adjustedCols = this.adjustedColsList.md;
    } else {
      this.adjustedCols = this.adjustedColsList.xs;
    }
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

  getScenes(){
    this.sceneService.getScenes().subscribe( scenes => this.scenes = scenes);
  }

  elementClicked(scene: number) {
    this.clicked = scene;
  }

  addElementClicked() {
    this.clicked = -99999;
  }
}
