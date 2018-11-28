import {Injectable} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddUserToWorkspaceService {
  private host = '131.104.48.82:5000';

  constructor(private auth: AuthenticationService, private http: HttpClient) {
  }

  addUserToWorkspace(workspaceId: string, email: string): Observable<Object> {
    return this.http.put(`http://${this.host}/workspaces/${workspaceId}`, {
      email
    }, {
      headers: this.auth.buildAuthHeader() // build the auth header using the auth token
    });
  }
}
