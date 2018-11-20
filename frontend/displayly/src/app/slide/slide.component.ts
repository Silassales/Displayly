import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SlideService} from '../slide.service';
import {MatDialog} from '@angular/material';

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
  workspaceId: string; // Stores the workspaceId id from the path
  loading: boolean;

  constructor(private route: ActivatedRoute, private slidesService: SlideService, private dialog: MatDialog, private router: Router) {
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
    // this.workspaceId = this.route.snapshot.paramMap.get('workspaceId');
    // if (!this.workspaceId) { // If we couldn't grab the workspaceId id from the url, redirect to the dashboard
    //   this.router.navigate(['dashboard']);
    //   return;
    // }
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

  getSlides() {
    this.loading = true;
    this.slidesService.getSlides(this.workspaceId).subscribe(
      slides => {
        this.slides = slides; // Set the scenes
      },
      err => {
        // TODO handle error here
      }, () => this.loading = false
    );
  }

  elementClicked(slide: string) {
    // TODO: Make this go to something
    this.router.navigate(['test'], {queryParams: {workspaceId: this.workspaceId, slideId: slide['id']}});
  }

  addElementClicked() {
    this.router.navigate(['dashboard/createSlide'], {queryParams: {workspaceId: this.workspaceId}});
  }

  // this.sceneService.getScenes().subscribe( scenes => this.scenes = scenes);

  // elementClicked(slide: number) {
  //   // TODO: Make this go to something
  // }

  // addElementClicked() {
  //   const dialogRef = this.dialog.open(CreateSceneModalComponent, {
  //     width: 'auto',
  //     data: {
  //       workspaceId: this.workspaceId
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(() => {
  //     this.getSlides(); // Refresh the scenes after the dialog has closed
  //   });
  // }
}
