import { Injectable } from '@angular/core';
import { ExtentObj } from '../shared-map/types/extent-object.interface';
import { Marker } from '../shared-map/types/marker.interface';

@Injectable({
  providedIn: 'root'
})
export class DataGeneratorService {

  constructor() { }

  generateMarkersBasedOnExtent(extent: ExtentObj): Marker[]{
    let markers: Marker[] = [];
    for(let i = 1; i <=  Math.floor(Math.random() * (15000 - 9000) + 9000); i++){
      markers.push({
        location: {
          lat: extent.minX + (Math.random() * (extent.maxX - extent.minX)),
          lng: extent.minY + (Math.random() * (extent.maxY - extent.minY))
        },
        timeStamp: new Date()
      })
    }
    return markers;
  };
   
}
