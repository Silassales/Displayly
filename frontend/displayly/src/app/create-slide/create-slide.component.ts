import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {SlideService} from '../slide.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-create-slide',
  templateUrl: './create-slide.component.html',
  styleUrls: ['./create-slide.component.css']
})
export class CreateSlideComponent implements OnInit {
  slideNameValidator = new FormControl('', [Validators.required]);
  selectedLayout: number = null;
  name: string;
  stepTwo = false;
  loading = false;
  workspaceId: string;

  constructor(private slides: SlideService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.slides.reset();
    // const id: number = this.route.snapshot.queryParamMap.get('workspaceId');
    // console.log(id);
    // this.workspaceId = this.route.snapshot.paramMap.get('workspaceId');
    this.workspaceId = this.route.snapshot.queryParamMap.get('workspaceId');
    if (!this.workspaceId) {
      this.router.navigate(['./dashboard/workspaces']);
    }
  }

  buttonDisabled() {
    return this.slideNameValidator.hasError('required') || this.selectedLayout == null;
  }

  select(layout: number) {
    this.selectedLayout = layout;
    this.slides.setLayoutId(layout);
  }

  next() {
    this.name = this.slideNameValidator.value;
    this.stepTwo = true;
  }

  saveDisabled(): boolean {
    return this.slides.prepareImgsArray() === null || this.loading;
  }

  save() {
    this.loading = true;
    this.slides.createSlide(this.workspaceId, this.name).subscribe(
      res => {
        this.router.navigate(['dashboard/slide'], {queryParams: {workspaceId: this.workspaceId}});
      }, err => {
        console.log(err);
      }, () => this.loading = false
    );
  }

}
