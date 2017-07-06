import { Component } from '@angular/core';
import {AlertController, LoadingController, Platform} from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker'
import { RemoteServiceProvider } from "../../providers/remote-service/remote-service";

// declaring variable google that is exported by the Google Maps SDK
declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [RemoteServiceProvider]
})

/**
 * The class loads the homepage and handles sending of location data of
 * the user to the remote URL.
 */
export class HomePage {

  // Geocoder object which retrieves the human readable address from the
  // location coordinates of the device
  public geocoder = new google.maps.Geocoder;

  // to switch between text advertisement and image advertisement
  public clickBit = 0;

  /*
  @param: locationTrackerProvider: gets the location coordinates of the
  user whenever they change significantly.
  @param: less: does something
  @param: remoteServiceProvider: sends the location information to the
  specified URL in the RemoteServiceProvider Module.
  @param: platform: ionic platform object used here to close the application
  @param: loadingCtrl: to show the loading when the process is running in the
  background.
  @param: alertCtrl: to show the alert when email is sent.
   */
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
    this.toggleBit();  // toggles the advertisement on every click
    // loading object to show the loading to the user
    let loading = this.loadingCtrl.create({
      content: 'Sending...please wait'
    });
    // starting the loading
    loading.present().then(() => {
      console.log('loader started');
    }, (error) => {
      console.error('can not start loader: ' + error);
    });
    // getting latitude and longitude information from locationTrackerProvider
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
        let message: string;
        let title: string;
        console.log('Adress: ' + address);
        let res = this.remoteServiceProvider.sendEmail(lat, lng, address);
        res.subscribe((data) => {
          console.log('address sent successfully');
          // message = 'Thanks for your contribution, have a lovely day !';
          title = '<ion-header><h3>Success</h3></ion-header>';
          message = '<ion-item><p style="font-size: large;"> Woof woof, have an awesome day!</p></ion-item>';
          loading.dismiss().then(() => {
            console.log('loader dismissed');
            this.emailAlert(title, message);
          });
        }, (error) => {
          console.error('error in sending email: ' + error);
          title = '<ion-header><h3>Error</h3></ion-header>';
          message = '<ion-item><p> Error while sending data, please try again!</p></ion-item>';
          loading.dismiss().then(() => {
            console.log('loader dismissed');
            this.emailAlert(title, message);
          });
        });
      }
    });
  }

  emailAlert(title, message) {
    console.log('alert message: ' + message);
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: 'Ok',
        cssClass: 'my-alert-button'
      }],
      cssClass: 'my-alert'
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
