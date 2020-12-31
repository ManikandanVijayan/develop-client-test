import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { map, filter, switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { JwtHelperService  } from '@auth0/angular-jwt';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'https://localhost:44351/api/auth/';
  userToken: any;
  decodedToken: any;
  //jwtHelper: JwtHelper = new JwtHelper();
  helper = new JwtHelperService();
  currentUser:User;
  private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

constructor(private http: HttpClient) { }

changeMemberPhoto(photoUrl: string) {
  this.photoUrl.next(photoUrl);
}

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
      this.decodedToken = this.helper.decodeToken(user.tokenString);
      localStorage.setItem('token', user.tokenString);
      localStorage.setItem('user', JSON.stringify(user.user));
      this.userToken = user.tokenString;
      this.currentUser = user.user;
      if (this.currentUser.photoUrl !== null) {
        this.changeMemberPhoto(this.currentUser.photoUrl);
      } else {
        this.changeMemberPhoto('../../assets/user.png');
      }
    }
  })).pipe(catchError(this.handleError));

}

// tslint:disable-next-line: typedef
register(user: User) {
    return this.http.post(this.baseUrl + 'register', user, this.requestOptions()).pipe(catchError(this.handleError));
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
  // tslint:disable-next-line: typedef
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

// usingjwttoken
  // tslint:disable-next-line: typedef
  loggedIn() {
    const token = localStorage.getItem('token');
    return token != null && !this.helper.isTokenExpired(token);
  }


}
