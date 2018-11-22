import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SlideService} from '../slide.service';
import {interval} from 'rxjs';
import {ScenesService} from '../scenes.service';

@Component({
  selector: 'app-scene-display',
  templateUrl: './scene-display.component.html',
  styleUrls: ['./scene-display.component.css']
})
export class SceneDisplayComponent implements OnInit {

  @Input() workspaceId: string;
  _sceneId: string;
  slides = [];
  visibleIndex = 0;

  constructor(private route: ActivatedRoute, private slideService: SlideService, private sceneService: ScenesService) {
  }

  ngOnInit() {
    if (!this.workspaceId) {
      this.workspaceId = this.route.snapshot.queryParamMap.get('workspaceId');
    }

    this.fetchSlides();

    interval(8000).subscribe(() => this.incrementIndex()); // Trigger a slide change every 8 seconds
  }

  @Input()
  set sceneId(sceneId: string) {
    this._sceneId = sceneId;
    this.fetchSlides();
  }

  fetchSlides() {
    this.sceneService.getSlides(this.workspaceId, this._sceneId).subscribe(
      slideIds => {
        this.slides = [];
        for (const slideId of slideIds) {
          this.slideService.getSlideDetails(this.workspaceId, slideId).subscribe(
            slide => {
              this.slides.push(slide);
            }, err => {
              console.log(err);
            }
          );
        }
      }, err => {
        console.log(err);
      }
    );
  }

  incrementIndex() {
    if (this.visibleIndex + 1 < this.slides.length) {
      this.visibleIndex++;
    } else {
      this.visibleIndex = 0;
    }
  }

}
