import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-displayly-toolbar-wrapper',
  templateUrl: './displayly-toolbar-wrapper.component.html',
  styleUrls: ['./displayly-toolbar-wrapper.component.css']
})
export class DisplaylyToolbarWrapperComponent implements OnInit {

  constructor(private auth: AuthenticationService, private location: Location, private router: Router, private route: ActivatedRoute) { }

  id: number;

  ngOnInit() {
    console.log(this.auth.isAuthenticated());
    if (!this.auth.isAuthenticated()) { // If the user is not authenticated, then redirect them to the homepage
      this.router.navigate(['/']);
    }
  }

  logout() {
    // Call logout and move the user to the homepage
    this.auth.logout();
    this.router.navigate(['/']);
  }

  inWorkspace() {
    return this.location.isCurrentPathEqualTo("/dashboard/workspace");
  }

  idEvent(event: number) {
    console.log("Getting id");
    this.id = event;
    console.log(this.id);
  }
  goToScene() {
    console.log("Scene Function:");
    console.log(this.id);
    this.router.navigate(['dashboard/scene/', this.id]);
  }
  goToSlide() {
    this.router.navigate(['dashboard/slide/', this.id]);
  }
  goToDisplay() {
    this.router.navigate(['dashboard/display/', this.id]);
  }

}
