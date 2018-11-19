import {Injectable} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DisplaysService{
  private host = '131.104.48.82:5000';

  constructor(private auth: AuthenticationService, private http: HttpClient) {
  }

  getDisplays(workspaceId: string): Observable<Object[]> {
    return this.http.get(`http://${this.host}/workspaces/${workspaceId}/displays`, {
      headers: this.auth.buildAuthHeader() // build the auth header using the auth token
    }).pipe(
      map(response => {
        return response['displays']; // Strip away the information we dont need from the response
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  createDisplay(workspaceId: string, name: string): Observable<Object> {
    return this.http.post(`http://${this.host}/workspaces/${workspaceId}/displays`, {
      name
    }, {
      headers: this.auth.buildAuthHeader() // build the auth header using the auth token
    });
  }

}
