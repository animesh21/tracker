import { Injectable, NgZone } from '@angular/core';
// import { Http } from '@angular/http';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';

/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LocationTrackerProvider {

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;

  constructor(public zone: NgZone,
              public backgroundGeolocation: BackgroundGeolocation,
              public geolocation: Geolocation) {
    console.log('Hello LocationTrackerProvider Provider');
  }

  startTracking() {
    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 2000
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {
      console.log('BackgroundLocation: ' + location.latitude + ', ' + location.longitude);

      // Run the update inside of Angular's zone
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
      });
    }, (error) => {
      console.error(error);
    });

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();


    // Foreground tracking

    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options)
      .filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
      console.log(position);
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });

    });
  }

  stopTracking() {
    console.log('Stop tracking');

    this.backgroundGeolocation.finish().then(() => {
      console.log('successfully stopped background tracking');
    }, (error) => {
      console.error('tracking ruk nahi rahi ' + error);
    });
    this.watch.unsubscribe();
  }

}
