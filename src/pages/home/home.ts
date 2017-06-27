import { Component } from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker'
import {RemoteServiceProvider} from "../../providers/remote-service/remote-service";
import { AlertController } from 'ionic-angular';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [RemoteServiceProvider]
})
export class HomePage {

  public geocoder = new google.maps.Geocoder;

  public clickBit = 0;

  constructor(public navCtrl: NavController,
              public locationTrackerProvider: LocationTrackerProvider,
              public remoteServiceProvider: RemoteServiceProvider,
              public alertCtrl: AlertController,
              public platform: Platform
  ) {

  }

  start() {
    this.locationTrackerProvider.startTracking();
  }

  stop() {
    this.locationTrackerProvider.stopTracking();
  }

  sendEmail() {
    let lat = this.locationTrackerProvider.lat;
    let lng = this.locationTrackerProvider.lng;

    // using reverse geocoding from google api to find out
    // address of the given coordinates
    let latLng = {
      lat: lat,
      lng: lng
    };
    this.geocoder.geocode({'location': latLng}, (results, status) => {
      if(status == 'OK') {
        let address = results[0]['formatted_address'];
        console.log('Adress: ' + address);
        this.remoteServiceProvider.sendEmail(lat, lng, address);
      }
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
