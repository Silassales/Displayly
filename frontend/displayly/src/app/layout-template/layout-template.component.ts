import {Component, Input, OnInit} from '@angular/core';
import {SlideService} from '../slide.service';

@Component({
  selector: 'app-layout-template',
  templateUrl: './layout-template.component.html',
  styleUrls: ['./layout-template.component.css']
})
export class LayoutTemplateComponent implements OnInit {

  @Input() width: number;
  @Input() layoutId: number;
  @Input() functional: boolean;
  boxWidth = 30;

  constructor(private slides: SlideService) { }

  ngOnInit() {
  }

}

@Component({
  selector: 'app-box',
  templateUrl: './box/box.component.html',
  styleUrls: ['./box/box.component.css']
})
export class BoxComponent {

  @Input() width: number; // Get the passed in width from the parent
  @Input() imgId: number;
  @Input() functional: boolean;
  private reader: FileReader;
  encodedImg: string;
  imgName: string;

  constructor(private slides: SlideService) {
    this.reader = new FileReader();
    this.reader.onload = (e) => {
      this.encodedImg = e.target['result'];
      this.slides.setImgIndex(this.imgId - 1, this.imgName, this.encodedImg);
    };
  }

  selectImg() {
    if (!this.functional) {
      return;
    }

    document.getElementById(`imgInput${this.imgId}`).click();
  }

  onFileChange(event) {
    if (!event.target.files[0]) {
      return;
    }
    this.imgName = event.target.files[0]['name'];
    this.reader.readAsDataURL(event.target.files[0]);
  }
}
