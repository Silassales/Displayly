import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-displayly-toolbar-wrapper',
  templateUrl: './displayly-toolbar-wrapper.component.html',
  styleUrls: ['./displayly-toolbar-wrapper.component.css']
})
export class DisplaylyToolbarWrapperComponent implements OnInit {

  constructor(private auth: AuthenticationService, private router: Router, private loc: Location) {
  }

  ngOnInit() {
    if (!this.auth.isAuthenticated()) { // If the user is not authenticated, then redirect them to the homepage
      this.router.navigate(['/']);
    }
  }

  onTestClick() {
    const myUrl: string = this.loc.path(false);
    const param: string[] = myUrl.split('?');
    const id: string[] = param[1].split('=');
    console.log(id[1]);
    return id[1];
  }

  logout() {
    // Call logout and move the user to the homepage
    this.auth.logout();
    this.router.navigate(['/']);
  }

  showButton() {
    return this.loc.isCurrentPathEqualTo('/dashboard/workspaceId');
  }

  onSlide() {
    const id = this.onTestClick();
    this.router.navigate(['dashboard/slide'], {queryParams: {workspaceId: id}});
  }

  onScene() {
    const id = this.onTestClick();
    this.router.navigate(['dashboard/scene'], {queryParams: {workspaceId: id}});

  }

  onDisplay() {
    const id = this.onTestClick();
    this.router.navigate(['dashboard/display'], {queryParams: {workspaceId: id}});

  }

}
