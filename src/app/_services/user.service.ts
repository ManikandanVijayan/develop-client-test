import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { map, filter, switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import {  throwError } from 'rxjs';
import { Http, RequestOptions } from '@angular/http';
import { PaginatedResult } from '../_models/pagination';
import { Response } from '@angular/http';
import { Message } from '../_models/message';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.baseUrl;

constructor(private http: HttpClient ) { }

private get authHeader(): string {
  return 'Bearer' + localStorage.getItem('token');
}

// tslint:disable-next-line: typedef
getUsers(page?: number, itemsPerPage?: number, userParams?: any, likesParam?: string) {
  const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
  let queryString = '?';

  if (page != null && itemsPerPage != null) {
      queryString += 'pageNumber=' + page + '&pageSize=' + itemsPerPage + '&';
    }

  if (userParams != null) {
      queryString +=
        'minAge=' + userParams.minAge +
        '&maxAge=' + userParams.maxAge +
        '&gender=' + userParams.gender +
        '&orderBy=' + userParams.orderBy;
    }

  if (likesParam === 'Likers') {
      queryString += 'Likers=true&';
    }

  if (likesParam === 'Likees') {
      queryString += 'Likees=true&';
    }

  return this.http.get(this.baseUrl + 'users' + queryString, this.jwt()).pipe(map((response: HttpResponse<any>) => {
    paginatedResult.result = response.body;
    if (response.headers.get('Pagination') != null) {
      paginatedResult.pagination = JSON.parse(
        response.headers.get('Pagination')
      );
    }

    return paginatedResult;
    })).pipe(catchError(this.handleError));
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
        }),
        observe :'response' as 'body'
      };
    return httpOptions;
  }
}

updateUser(id: number, user: User) {
  return this.http.put(this.baseUrl + 'users/' + id, user, this.jwt()).pipe(catchError(this.handleError));
}

setMainPhoto(userId: number, id: number) {
  return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {}, this.jwt()).pipe(catchError(this.handleError));
}

sendLike(id: number, recipientId: number) {
  return this.http.post(this.baseUrl + 'users/' + id +  '/like/' + recipientId, {}, this.jwt()).pipe(catchError(this.handleError));
}

deletePhoto(userId: number, id: number) {
  return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id, this.jwt()).pipe(catchError(this.handleError));
}

  getMessages(id: number, page?: number, itemsPerPage?: number, messageContainer?: string) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
    let queryString = '?MessageContainer=' + messageContainer;

    if (page != null && itemsPerPage != null) {
      queryString += '&pageNumber=' + page + '&pageSize=' + itemsPerPage;
    }


    return this.http.get(this.baseUrl + 'users/' + id + '/messages' + queryString, this.jwt())
    .pipe
      (map((response: Response) => {
        paginatedResult.result = response;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
    })).pipe(catchError(this.handleError));
  }

  getMessageThread(id: number, recipientId: number) {
    return this.http.get(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId, this.jwt()).pipe(map((response: Response) => {
      return response;
    })).pipe(catchError(this.handleError));
  }

  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + 'users/' + id + '/messages', message, this.jwt()).pipe(map((response: Response) => {
      return response;
    })).pipe(catchError(this.handleError));
  }

  deleteMessage(id: number, userId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {}, this.jwt()).pipe(catchError(this.handleError));
  }

  markAsRead(userId: number, messageId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read', {}, this.jwt()).subscribe();
  }




// tslint:disable-next-line: typedef
private handleError(error: any) {
  if (error.status === 400) {
    return Observable.throw(error._body);
  }
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
