import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() {}

  // tslint:disable-next-line: typedef
  confirm(message: string, okCallback: () => any) {
    // tslint:disable-next-line: typedef
    alertify.confirm(message, function(e) {
      if (e) {
        okCallback();
      } else {
      }
    });
  }

  // tslint:disable-next-line: typedef
  success(message: string) {
    alertify.success(message);
  }

  // tslint:disable-next-line: typedef
  error(message: string) {
    alertify.error(message);
  }

  // tslint:disable-next-line: typedef
  warning(message: string) {
    alertify.warning(message);
  }

  // tslint:disable-next-line: typedef
  message(message: string) {
    alertify.message(message);
  }

}
