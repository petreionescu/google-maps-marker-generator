import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExtentObj } from '../shared-map/types/extent-object.interface';
import { Marker } from '../shared-map/types/marker.interface';

@Injectable({
  providedIn: 'root'
})
export class DataGeneratorService {

  constructor(
    private datePipe: DatePipe
  ) { }

  generateMarkersBasedOnExtent(extent: ExtentObj): Observable<Marker[]>{
    return new Observable<Marker[]>((observer) => {
      setTimeout(() => {
        let markers: Marker[] = [];
        for(let i = 1; i <=  Math.floor(Math.random() * (15000 - 9000) + 9000); i++){
          markers.push({
            location: {
              lat: extent.minX + (Math.random() * (extent.maxX - extent.minX)),
              lng: extent.minY + (Math.random() * (extent.maxY - extent.minY))
            },
            timeStamp: this.datePipe.transform(new Date(), 'yyyy-MM-dd, h:mm:ss:SSS a')
          })
        };
        observer.next(markers);
        observer.complete();
      }, 0);
    });
  };
}
