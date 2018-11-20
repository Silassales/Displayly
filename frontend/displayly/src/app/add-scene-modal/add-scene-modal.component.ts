import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {ScenesService} from '../scenes.service';
import {DisplaysService} from '../display.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-scene-modal',
  templateUrl: './add-scene-modal.component.html',
  styleUrls: ['./add-scene-modal.component.css']
})
export class AddSceneModalComponent implements OnInit {

  workspaceId: string;
  displayId: string;
  displayName: string;
  selectedScene: string;
  scenes: object[];
  loading = true;

  constructor(private sceneService: ScenesService,
              private displayService: DisplaysService,
              private dialog: MatDialog,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  ngOnInit() {
    this.workspaceId = this.data['workspaceId'];
    this.displayId = this.data['displayId'];
    this.displayName = this.data['displayName'];
    this.selectedScene = this.data['selectedScene'];
    this.getScenes();
  }

  getScenes() {
    this.loading = true;
    this.sceneService.getScenes(this.workspaceId).subscribe(
      res => this.scenes = res,
      err => console.log(err),
      () => this.loading = false
    );
  }

  elementClicked(scene) {
    if (this.selectedScene === scene['id']) {
      this.selectedScene = null;
    } else {
      this.selectedScene = scene['id'];
    }
  }

  saveScene() {
    this.loading = true;
    this.displayService.putScene(this.workspaceId, this.displayId, this.selectedScene).subscribe(
      res => this.dialog.closeAll(),
      err => console.log(err)
    );
  }

  showDisplay() {
    window.open(`/showDisplay?displayId=${this.displayId}&workspaceId=${this.workspaceId}`, '_blank');
  }

}
