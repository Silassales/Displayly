import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SlideService} from '../slide.service';
import {MatDialog} from '@angular/material';
// import {CreateSl} from '../create-scene-modal/create-scene-modal.component';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.css']
})
export class SlideComponent implements OnInit {
  adjustedCols: number;
  adjustedColsList = {
    xl: 6,
    md: 3,
    xs: 1
  };
  slides = [];
  workspaceId: string; // Stores the workspace id from the path
  loading: boolean;


  constructor(private route: ActivatedRoute, private slidesService: SlideService, private dialog: MatDialog, private router: Router) {
  }

  ngOnInit() {
    if (window.innerWidth >= 1000) {
      this.adjustedCols = this.adjustedColsList.xl;
    } else if (window.innerWidth >= 500) {
      this.adjustedCols = this.adjustedColsList.md;
    } else {
      this.adjustedCols = this.adjustedColsList.xs;
    }
    this.workspaceId = this.route.snapshot.paramMap.get('workspaceId');
    if (!this.workspaceId) { // If we couldn't grab the workspace id from the url, redirect to the dashboard
      this.router.navigate(['dashboard']);
      return;
    }
    this.getSlides();
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

  private getSlides() {
    this.loading = true;
    this.slidesService.getSlides(this.workspaceId).subscribe(
      slides => {
        this.slides = slides; // Set the slides
      },
      err => {
        // TODO handle error here
      }, () => this.loading = false
    );
  }
  elementClicked(scene: number) {
    // TODO: Make this go to something
  }

  // addElementClicked() {
  // jack is doing this
  // }

}
