import {Component, OnInit} from '@angular/core';
import {DisplaysService} from '../display.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {CreateDisplayModalComponent} from '../create-display-modal/create-display-modal.component';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  adjustedCols: number;
  adjustedColsList = {
    xl: 6,
    md: 3,
    xs: 1
  };
  displays = [];
  workspaceId: string; // Stores the workspace id from the path
  loading: boolean;


  constructor(private route: ActivatedRoute, private displayService: DisplaysService, private dialog: MatDialog, private router: Router) {
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
    console.log("Slide: " + id);
    this.workspaceId = id.toString();
    // this.workspaceId = this.route.snapshot.paramMap.get('workspaceId');
    // if (!this.workspaceId) { // If we couldn't grab the workspace id from the url, redirect to the dashboard
    //   this.router.navigate(['dashboard']);
    //   return;
    // }
    this.getDisplays();
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

  getDisplays() {
    this.loading = true;
    this.displayService.getDisplays(this.workspaceId).subscribe(
      displays => {
        this.displays = displays; // Set the scenes
      },
      err => {
        // TODO handle error here
      }, () => this.loading = false
    );
    // this.sceneService.getScenes().subscribe( scenes => this.scenes = scenes);
  }

  // elementClicked(slide: number) {
  //   // TODO: Make this go to something
  // }

  addElementClicked() {
    const dialogRef = this.dialog.open(CreateDisplayModalComponent, {
      width: 'auto',
      data: {
        workspaceId: this.workspaceId
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getDisplays(); // Refresh the scenes after the dialog has closed
    });
  }
}