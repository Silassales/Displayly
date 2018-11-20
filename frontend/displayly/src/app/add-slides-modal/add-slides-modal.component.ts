import {Component, Inject, OnInit} from '@angular/core';
import {SlideService} from '../slide.service';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {ScenesService} from '../scenes.service';

@Component({
  selector: 'app-add-slides-modal',
  templateUrl: './add-slides-modal.component.html',
  styleUrls: ['./add-slides-modal.component.css']
})
export class AddSlidesModalComponent implements OnInit {

  workspaceId: string;
  sceneName: string;
  sceneId: string;
  slides: object[];
  loading = true;
  selectedSlides: string[];

  constructor(private slideService: SlideService, private scenesService: ScenesService, @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    console.log(this.data);
    this.workspaceId = this.data['workspaceId'];
    this.sceneName = this.data['sceneName'];
    this.sceneId = this.data['sceneId'];
    this.selectedSlides = this.data['slides'].map(String);
    console.log(this.selectedSlides);
    this.getSlides();

  }

  getSlides() {
    this.loading = true;
    this.slideService.getSlides(this.workspaceId).subscribe(
      slides => {
        this.slides = slides; // Set the slides
      },
      err => {
        // TODO handle error here
      }, () => this.loading = false
    );
  }

  elementClicked(slide) {
    const id = slide['id'].toString();
    const index = this.selectedSlides.indexOf(id);
    if (index === -1) {
      this.selectedSlides.push(id);
    } else {
      this.selectedSlides.splice(index, 1);
    }
  }

  saveSlides() {
    this.selectedSlides = this.selectedSlides.sort();
    this.scenesService.putSlides(this.workspaceId, this.sceneId, this.selectedSlides).subscribe(
      res => {
        console.log(res);
      }, err => {
        console.log(err);
      }
    )
  }

}
