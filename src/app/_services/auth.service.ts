import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { map, filter, switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'https://localhost:44351/api/auth/';
  userToken: any;

constructor(private http: HttpClient) { }

// tslint:disable-next-line: typedef
login(model: any)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      })
    };

  // tslint:disable-next-line: typedef-whitespace
  // tslint:disable-next-line: deprecation
  return this.http.post(this.baseUrl + 'login', model, httpOptions).pipe(map((response: Response) => {
    console.log(response);
    const userr = JSON.stringify(response);
    const user = JSON.parse(userr);
    console.log(user);
    if (user)
    {
      localStorage.setItem('token', user.tokenString);
      this.userToken = user.tokenString;
    }
  })).pipe(catchError(this.handleError));

}

// tslint:disable-next-line: typedef
register(model: any) {
    return this.http.post(this.baseUrl + 'register', model, this.requestOptions()).pipe(catchError(this.handleError));
  }

  // tslint:disable-next-line: typedef
  private requestOptions() {
    const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      })
    };
    return httpOptions;
  }


  // handle error
  private handleError(error: any)
  {
    const applicationError = error.headers.get('Application-Error');
    if (applicationError)
    {
      // tslint:disable-next-line: deprecation
      return throwError(applicationError);
    }
    const serverError = error;
    let modelStateErrors = '';
    if (serverError)
    {
      for (const key in serverError)
      {
        if (serverError[key])
        {
          modelStateErrors += serverError[key] + '\n';
        }
      }
    }
    // tslint:disable-next-line: deprecation
    return throwError(
      modelStateErrors || 'Server error'
    );
  }


}
