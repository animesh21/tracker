import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
/*
 Generated class for the RemoteServiceProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class RemoteServiceProvider {

  email_url: string = 'http://studio-tesseract.co/tracking/sendmail.php/';
  constructor(
    public http: Http,
    public alertCtrl: AlertController
  ) {
    console.log('Hello RemoteServiceProvider Provider');
  }

  sendEmail(lat, lng) {

    let body = {'lat': lat, 'lng': lng};

    this.http.post(this.email_url, body)
      .subscribe((data) => {
      let message = 'Email Sent Successfully!';
      console.log(message);
      this.emailAlert(message);
      }, (error) => {
      let message = 'Error In Sending Email ';
      console.log(message, error);
      this.emailAlert(message);
      });
  }

  emailAlert(message) {
    let alert = this.alertCtrl.create({
      'title': message,
      'buttons': ['Ok']
    });
    alert.present();
  }
}
