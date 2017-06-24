import { Component } from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker'
import {RemoteServiceProvider} from "../../providers/remote-service/remote-service";
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [RemoteServiceProvider]
})
export class HomePage {


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
    this.remoteServiceProvider.sendEmail(lat, lng);
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
}
