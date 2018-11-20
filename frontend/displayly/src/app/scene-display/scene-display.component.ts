import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SlideService} from '../slide.service';
import {interval} from 'rxjs';

@Component({
  selector: 'app-scene-display',
  templateUrl: './scene-display.component.html',
  styleUrls: ['./scene-display.component.css']
})
export class SceneDisplayComponent implements OnInit {

  workspaceId: string;
  sceneId: string;
  slides = [];
  visibleIndex = 0;

  constructor(private route: ActivatedRoute, private slideService: SlideService) {
  }

  ngOnInit() {
    if (!this.workspaceId) {
      this.workspaceId = this.route.snapshot.queryParamMap.get('workspaceId');
    }
    if (!this.sceneId) {
      this.sceneId = this.route.snapshot.queryParamMap.get('sceneId');
    }
    this.fetchSlides();


    interval(8000).subscribe(() => this.incrementIndex()); // Trigger a slide change every 8 seconds
  }

  fetchSlides() {
    // TODO: use the api for this
    const temp = [
      39,
      40
    ].map(String);

    for (const slideId of temp) {
      this.slideService.getSlideDetails(this.workspaceId, slideId).subscribe(
        res => {
          this.slides.push(res);
        }, err => {
          console.log(err);
        }
      );
    }
  }

  incrementIndex() {
    if (this.visibleIndex + 1 < this.slides.length) {
      this.visibleIndex ++;
    } else {
      this.visibleIndex = 0;
    }
  }

}
