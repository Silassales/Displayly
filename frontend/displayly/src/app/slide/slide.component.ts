import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SlideService} from '../slide.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {WorkspaceHelpDialogComponent} from '../workspace/workspace.component';

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
  sortTypes = ['Id', 'Name'];
  workspaceId: string; // Stores the workspaceId id from the path
  loading: boolean;
  selected: number;
  error: string;

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
    this.error = '';
    this.selected = null;
    this.slidesService.getSlides(this.workspaceId).subscribe(
      slides => {
        this.slides = slides; // Set the scenes
      },
      err => {
        this.error = err['error']['error'];
      }, () => this.loading = false
    );
  }

  elementClicked(slide) {
    if (this.selected === slide['id']) {
      this.selected = null;
    } else {
      this.selected = slide['id'];
    }
  }

  previewSlide() {
    window.open(`/showSlide?slideId=${this.selected}&workspaceId=${this.workspaceId}`, '_blank');
  }

  deleteSlide() {
    this.dialog.open(ConfirmDialogComponent, {
      width: 'auto',
      data: {
        question: `Are you sure you want to delete this slide?`,
        yes: () => {
          this.error = '';
          this.slidesService.deleteSlide(this.workspaceId, this.selected).subscribe(
            res => this.getSlides(),
            err => {
              this.error = err['error']['error'];
              console.log(err);
            }
          );
        },
        no: () => {
        }
      }
    });
  }

  addElementClicked() {
    this.router.navigate(['dashboard/createSlide'], {queryParams: {workspaceId: this.workspaceId}});
  }

  sortOptionClicked(sortOption: string) {
    if (sortOption === 'Id' || sortOption === 'Default') {
      this.slides.sort((a, b) => {
        return a.id - b.id;
      });
    } else if (sortOption === 'Name') {
      this.slides.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    }
  }

  openSlideHelpDialog() {
    const dialogRef = this.dialog.open(SlideHelpDialogComponent, {
      width: '25%'
    });
  }
}

@Component({
  selector: 'app-slide-help-dialog',
  templateUrl: 'slide-help-dialog.html'
})
export class SlideHelpDialogComponent {
  constructor(public dialogRef: MatDialogRef<SlideHelpDialogComponent>) { }

  closeDialog() {
    this.dialogRef.close();
  }
}
