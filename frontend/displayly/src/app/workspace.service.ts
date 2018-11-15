import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {


  private host = '131.104.48.83:5000';

  constructor(private auth: AuthenticationService, private http: HttpClient) {
  }

  getWorkspaces(): Observable<Object> {
    return this.http.get(`http://${this.host}/workspaces`, {
      headers: this.auth.buildAuthHeader()
    });
  }

  createWorkspace(name: string): Observable<Object> {
    return this.http.post(`http://${this.host}/workspaces`, {
      name
    }, {
      headers: this.auth.buildAuthHeader()
    });
  }
}

