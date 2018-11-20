import {Injectable} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScenesService {
  private host = '131.104.48.82:5000';

  constructor(private auth: AuthenticationService, private http: HttpClient) {
  }

  getScenes(workspaceId: string): Observable<Object[]> {
    return this.http.get(`http://${this.host}/workspaces/${workspaceId}/scenes`, {
      headers: this.auth.buildAuthHeader() // build the auth header using the auth token
    }).pipe(
      map(response => {
        return response['scenes']; // Strip away the information we dont need from the response
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  createScene(workspaceId: string, name: string): Observable<Object> {
    return this.http.post(`http://${this.host}/workspaces/${workspaceId}/scenes`, {
      name
    }, {
      headers: this.auth.buildAuthHeader() // build the auth header using the auth token
    });
  }

  putSlides(workspaceId: string, sceneId: string, slides: string[]): Observable<Object> {
    return this.http.put(`http://${this.host}/workspaces/${workspaceId}/scenes/${sceneId}`, {
      slides
    }, {
      headers: this.auth.buildAuthHeader() // build the auth header using the auth token
    });
  }

  getSlides(workspaceId: string, sceneId: string): Observable<string[]> {
    return this.http.get(`http://${this.host}/workspaces/${workspaceId}/scenes/${sceneId}`, {
      headers: this.auth.buildAuthHeader() // build the auth header using the auth token
    }).pipe(
      map(response => {
        return response['scenes'].map(String); // Strip away the information we dont need from the response
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
