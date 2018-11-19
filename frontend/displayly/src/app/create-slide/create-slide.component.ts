import { Component, OnInit } from '@angular/core';
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
  workspace = '58';

  constructor(private slides: SlideService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.slides.reset();
    this.workspace = this.route.snapshot.paramMap.get('workspaceId');
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
    this.slides.createSlide(this.workspace, this.name).subscribe(
      res => {
        this.router.navigate(['./slides']);
      }, err => {
        console.log(err);
      }, () => this.loading = false
    );
  }

}
