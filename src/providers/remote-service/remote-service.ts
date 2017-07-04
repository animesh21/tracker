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
  constructor(
    public http: Http
  ) {
    console.log('Hello RemoteServiceProvider Provider');
  }

  sendEmail(lat, lng, address) {

    let body = {'lat': lat, 'lng': lng, 'address': address};

    return this.http.post(this.email_url, body);
  }
}
