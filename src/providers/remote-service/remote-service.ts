import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
/*
 Generated class for the RemoteServiceProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class RemoteServiceProvider {

  email_url: string = 'http://studio-tesseract.co/tracking/sendmail.php/';
  // email_url: string = 'http://127.0.0.1:8000/users/';
  constructor(
    public http: Http
  ) {
    console.log('Hello RemoteServiceProvider Provider');
  }

  sendEmail(lat, lng, address) {

    let body = {'lat': lat, 'lng': lng, 'address': address};

    return this.http.post(this.email_url, body);
    // return this.http.get(this.email_url);
  }
}
