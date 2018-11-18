import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecoveryService {

  private question: string;
  private token: string;
  private host = '131.104.48.82:5000';

  constructor(private http: HttpClient) { }

  getQuestion(email: string): Observable<Object> {
    return this.http.get(`http://${this.host}/user/forgot`,  {
      params: new HttpParams().set('email', email)
    }).pipe(
      map(response => {
        console.log(response);
        this.question = response['question'];
        return response;
      }),
      catchError( error => {
        return throwError(error);
      })
    );
  }

  attemptRecovery(email: string, answer: string): Observable<Object> {
    return this.http.post(`http://${this.host}/user/forgot`, {
      email,
      answer
    }).pipe(
      map(response => {
        console.log(response);
        this.token = response['resetToken'];
        return response;
      }),
      catchError( error => {
        return throwError(error);
      })
    );
  }

  resetPassword(password: string): Observable<Object> {
    const headers = new HttpHeaders({
      'Authorization': this.token
    });

    return this.http.post(`http://${this.host}/user/reset`, {
      password
    }, { headers }).pipe(
      map(response => {
        this.token = null;
        this.question = null;
        console.log(response);
        return response;
      }),
      catchError( error => {
        return throwError(error);
      })
    );
  }
}
