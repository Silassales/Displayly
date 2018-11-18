import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceserviceService {


  private host = '131.104.48.82:5000';

  constructor(private auth: AuthenticationService, private http: HttpClient) { }


  getWorkspaces(): Observable<Object> {
    const headers = new HttpHeaders({
      'Authorization': this.auth.getToken()
    });
    return this.http.get(`http://${this.host}/workspaces`, {
      headers
    });
  }
}

