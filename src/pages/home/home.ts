import { Component } from '@angular/core';
import {AlertController, LoadingController, Platform} from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker'
import { RemoteServiceProvider } from "../../providers/remote-service/remote-service";

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [RemoteServiceProvider]
})
export class HomePage {

  public geocoder = new google.maps.Geocoder;

  public clickBit = 0;

  constructor(public locationTrackerProvider: LocationTrackerProvider,
              public remoteServiceProvider: RemoteServiceProvider,
              public platform: Platform,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
  }

  start() {
    this.locationTrackerProvider.startTracking()
  }

  stop() {
    this.locationTrackerProvider.stopTracking();
  }

  sendEmail() {
    this.toggleBit();
    let loading = this.loadingCtrl.create({
      content: 'Sending...please wait'
    });
    loading.present().then(() => {
      console.log('loader started');
    }, (error) => {
      console.error('can not start loader: ' + error);
    });
    let lat = this.locationTrackerProvider.lat;
    let lng = this.locationTrackerProvider.lng;

    // using reverse geocoding with google api to find out
    // address of the given coordinates
    let latLng = {
      lat: lat,
      lng: lng
    };
    this.geocoder.geocode({'location': latLng}, (results, status) => {
      if(status == 'OK') {
        let address = results[0]['formatted_address'];
        let message: string = 'Thanks for your contribution, have a lovely day !';
        console.log('Adress: ' + address);
        let res = this.remoteServiceProvider.sendEmail(lat, lng, address);
        res.subscribe((data) => {
          console.log('email sent successfully');
          message = 'Thanks for your contribution, have a lovely day !';
        }, (error) => {
          console.error('error in sending email: ' + error);
          message = 'Error while sending data, please try again !';
        });
        loading.dismiss().then(() => {
          console.log('loader dismissed');
          this.emailAlert(message);
        });
      }
    });
  }

  emailAlert(message) {
    console.log('alert message: ' + message);
    let alert = this.alertCtrl.create({
      'title': message,
      'buttons': ['Ok']
    });
    alert.present().then(() => {
      console.log('alert fired');
    }, (error) => {
      console.error('error in firing alert: ' + error);
    });
  }


  ionViewDidLoad() {
    console.log('IonViewDidLoad: Home');
    this.start();
  }

  exitApp() {
    this.stop();
    console.log('Exiting the app...');
    this.platform.exitApp();
  }

  toggleBit() {
    this.clickBit = 1 - this.clickBit;
  }
}
