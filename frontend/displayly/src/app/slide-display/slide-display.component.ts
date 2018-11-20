import {Component, Input, OnInit} from '@angular/core';
import {SlideService} from '../slide.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-slide-display',
  templateUrl: './slide-display.component.html',
  styleUrls: ['./slide-display.component.css']
})
export class SlideDisplayComponent implements OnInit {

  @Input() workspaceId: string;
  @Input() slideId: string;
  loading = false;
  @Input() layoutId: string;
  @Input() images: string[];

  constructor(private route: ActivatedRoute, private router: Router, private slidesService: SlideService) {
  }

  ngOnInit() {
    if (this.route.snapshot.queryParamMap.get('slideId') && this.route.snapshot.queryParamMap.get('workspaceId')) {
      this.workspaceId = this.route.snapshot.queryParamMap.get('workspaceId');
      this.slideId = this.route.snapshot.queryParamMap.get('slideId');
      this.getSlideImages();
    }
  }

  showSlide(): boolean {
    return !this.loading && this.layoutId !== null && this.images !== null;
  }

  getSlideImages() {
    this.loading = true;
    this.slidesService.getSlideDetails(this.workspaceId, this.slideId).subscribe(
      res => {
        this.layoutId = res['layoutId'];
        this.images = res['images'];
      },
      err => {
        console.log(err);
      }, () => {
        this.loading = false;
      }
    );
  }

}
