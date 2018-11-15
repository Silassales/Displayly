import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SceneserviceService {


  scenes = ["1", "2", "3", "4", "5", "6", "7", "8"];
  constructor() { }

  getScenes(): Observable<String[]> {
      return of(this.scenes);
  }
}
