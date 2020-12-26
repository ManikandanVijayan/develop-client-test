import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { map, filter, switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import {  throwError } from 'rxjs';
import { RequestOptions } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.baseUrl;

constructor(private http: HttpClient ) { }

private get authHeader(): string {
  return 'Bearer' + localStorage.getItem('token');
}

getUsers(): Observable<User[]> {
  return this.http.get(this.baseUrl + 'users', this.jwt())
    .pipe
    (map
      (response => <User[]> response)
    )
    .pipe(catchError(this.handleError));
}

getUser(id): Observable<User> {
  return this.http
    .get(this.baseUrl + 'users/' + id, this.jwt())
    .pipe
    (map(response => <User>response)
    )
    .pipe(catchError(this.handleError));
}

// tslint:disable-next-line: typedef
private jwt(){
  const token = localStorage.getItem('token');
  if (token)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        // tslint:disable-next-line: object-literal-key-quotes
        'Authorization': 'Bearer ' + token,
        'Content-type':  'application/json'
        })
      };
    return httpOptions;
  }
}




// tslint:disable-next-line: typedef
private handleError(error: any) {
  const applicationError = error.headers.get('Application-Error');
  if (applicationError) {
    return throwError(applicationError);
  }
  const serverError = error.json();
  let modelStateErrors = '';
  if (serverError) {
    for (const key in serverError) {
      if (serverError[key]) {
        modelStateErrors += serverError[key] + '\n';
      }
    }
  }
  return throwError(
    modelStateErrors || 'Server error'
  );
}






}
