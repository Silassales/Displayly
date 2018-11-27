import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DisplaysService} from '../display.service';
import {interval} from 'rxjs';

@Component({
  selector: 'app-show-display',
  templateUrl: './show-display.component.html',
  styleUrls: ['./show-display.component.css']
})
export class ShowDisplayComponent implements OnInit {

  workspaceId: string;
  displayId: string;
  sceneId: string;

  constructor(private route: ActivatedRoute, private displayService: DisplaysService) {
  }

  ngOnInit() {
    if (!this.workspaceId) {
      this.workspaceId = this.route.snapshot.queryParamMap.get('workspaceId');
    }
    if (!this.displayId) {
      this.displayId = this.route.snapshot.queryParamMap.get('displayId');
    }

    this.fetchDisplay();
    interval(10000).subscribe(e => this.fetchDisplay());
  }

  fetchDisplay() {
    this.displayService.getDisplay(this.workspaceId, this.displayId).subscribe(
      res => {
        const sceneId = res['sceneId'];
        if (sceneId && this.sceneId !== sceneId.toString()) { // Prevents the screen from being replaced if the scene hasn't changed
          this.sceneId = sceneId.toString();
        }
      },
      err => console.log(err)
    );
  }

}
