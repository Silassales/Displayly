import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-displayly-toolbar-wrapper',
  templateUrl: './displayly-toolbar-wrapper.component.html',
  styleUrls: ['./displayly-toolbar-wrapper.component.css']
})
export class DisplaylyToolbarWrapperComponent implements OnInit {

  constructor(private auth: AuthenticationService, private router: Router) { }

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

}
