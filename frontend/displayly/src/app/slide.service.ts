import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SlideService {
  private host = '131.104.48.82:5000';
  private layoutId: number;
  private images: Object[];

  constructor(private http: HttpClient, private auth: AuthenticationService) {
    this.reset();
  }

  public reset() {
    this.layoutId = null;
    this.images = [];
  }

  setLayoutId(layoutId: number) {
    if (layoutId !== 1 && layoutId !== 2) {
      return;
    }
    this.layoutId = layoutId;
    console.log(this.layoutId);
  }

  setImgIndex(index: number, name: string, data: string) {
    if (!this.layoutId) {
      return;
    }
    this.images[index] = {
      name,
      data: data.substring(data.indexOf(',') + 1)
    };
  }

  createSlide(workspace: string, name: string): Observable<object> {
    return this.http.post(`http://${this.host}/workspaces/${workspace}/slides`, {
      name,
      layoutId: this.layoutId,
      images: this.prepareImgsArray()
    }, {
      headers: this.auth.buildAuthHeader()
    }).pipe(map(response => {
        this.reset();
        return response;
      }),
      catchError(error => {
        return throwError(error);
      }));
  }

  prepareImgsArray() {
    const tempArray = [];
    let k = 0;
    if (this.layoutId === 1) {
      k = 3;
    } else if (this.layoutId === 2) {
      k = 6;
    } else {
      return null;
    }
    for (let i = 0; i < k; i++) {
      if (this.images[i]) {
        tempArray[i] = this.images[i];
      } else {
        return null;
      }
    }
    return tempArray;
  }

  getSlides(workspaceId: string): Observable<Object[]> {
    return this.http.get(`http://${this.host}/workspaces/${workspaceId}/slides`, {
      headers: this.auth.buildAuthHeader() // build the auth header using the auth token
    }).pipe(
      map(response => {
        return response['slides']; // Strip away the information we dont need from the response
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  getSlideDetails(workspaceId: string, slideId: string): Observable<Object> {
    return this.http.get(`http://${this.host}/workspaces/${workspaceId}/slides/${slideId}`, {
      headers: this.auth.buildAuthHeader() // build the auth header using the auth token
    }).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
