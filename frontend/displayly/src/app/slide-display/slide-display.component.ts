import {Component, OnInit} from '@angular/core';
import {SlideService} from '../slide.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-slide-display',
  templateUrl: './slide-display.component.html',
  styleUrls: ['./slide-display.component.css']
})
export class SlideDisplayComponent implements OnInit {

  workspaceId: string;
  slideId: string;
  loading = true;
  layoutId: string;
  images: string[];

  constructor(private route: ActivatedRoute, private router: Router, private slidesService: SlideService) {
  }

  ngOnInit() {
    this.workspaceId = this.route.snapshot.queryParamMap.get('workspaceId');
    this.slideId = this.route.snapshot.queryParamMap.get('slideId');

    if (!this.workspaceId || !this.slideId) { // If we dont have the workspaceId or slideId redirect to workspaces
      this.router.navigate(['./dashboard/workspaces']);
      return;
    }
    this.getSlideImages();
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
