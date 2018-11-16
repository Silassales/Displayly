import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private host = '131.104.48.83:5000';

  constructor(private http: HttpClient) { }

  isAuthenticated() {
    return (sessionStorage.getItem('token') !== null);
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  authenticate(email: string, password: string): Observable<Object> {
    return this.http.post(`http://${this.host}/user/login`, {
      email,
      password
    }).pipe(
      map(response => {
        sessionStorage.setItem('token', response['token']); // Save the token from the response
        return response;
      }),
      catchError( error => {
        return throwError(error);
      })
    );
  }

  register(email: string, password: string, question: string, answer: string, name: string) {
    return this.http.post(`http://${this.host}/user/register`, {
      email,
      password,
      question,
      answer,
      name
    });
  }

  logout() {
    sessionStorage.removeItem('token'); // Clear the user's session token
  }

  buildAuthHeader() {
    return new HttpHeaders({
      'Authorization': this.getToken()
    });
  }
}
