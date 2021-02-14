/// <reference types="@types/googlemaps" />
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Marker } from '../../types/marker.interface';
import { environment } from '../../../../../environments/environment';
import { ExtentObj } from '../../types/extent-object.interface';


@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit, OnDestroy, OnChanges {
  public vectorMap: google.maps.Map;
  private drawingmanager: google.maps.drawing.DrawingManager;
  private listeners: { 
    markers: google.maps.MapsEventListener[], 
    drawing: google.maps.MapsEventListener[]
  } = {markers: [], drawing: []};
  private googleMarkers: google.maps.Marker[] = [];
  private infoWindow: google.maps.InfoWindow = null;

  @Input('markers') markers: Marker[] = [];
  @Output('drawRectangleComplete') drawRectangleComplete: EventEmitter<ExtentObj> = new EventEmitter();
  @Output('markerRenderComplete') markerRenderComplete: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.initScript();
  }

  ngOnDestroy(): void {
    this.listeners.drawing.forEach((listener) => listener.remove());
    this.removeMarkersAndListeners(); 
  };

  ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.markers.currentValue){
      this.drawMarkers(changes.markers.currentValue);
      this.markerRenderComplete.next(true);
    }
  }
  
  initScript(): void{
    let script: HTMLScriptElement = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=drawing`;
    script.onload = () => {
      window['initMap'] = this.initializeMap(); 
    }
    document.head.appendChild(script);
  }

  initializeMap(): void{
    this.vectorMap = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: { lat: 0, lng: 0 },
      zoom: 3,
    });
    
    this.infoWindow = new google.maps.InfoWindow({});
    
    this.drawingmanager = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.RECTANGLE
        ]
      }
    });
    this.drawingmanager.setMap(this.vectorMap);
    
    let rectangleCompleteListener = google.maps.event.addListener(this.drawingmanager, 'rectanglecomplete', (rectangle:google.maps.Rectangle) => {
      this.removeMarkersAndListeners();
      
      let bounds: google.maps.LatLngBounds = rectangle.getBounds();
      this.vectorMap.fitBounds(bounds);
      
      this.drawRectangleComplete.next({
        minX: bounds.getSouthWest().lat(), 
        minY: bounds.getNorthEast().lng(), 
        maxX: bounds.getNorthEast().lat(), 
        maxY: bounds.getSouthWest().lng()  
      });

      //clear the current rectangle
      rectangle.setMap(null);
    })
    this.listeners.drawing.push(rectangleCompleteListener);
  }

  drawMarkers(markers: Marker[]): void {
    markers.forEach((element) => {
      let marker = new google.maps.Marker({
        position: {
          lat: element.location.lat,
          lng: element.location.lng
        },
        map: this.vectorMap,
        title: element.timeStamp.toISOString(),
        optimized: true
      })
      this.googleMarkers.push(marker);
      this.listeners.markers.push(google.maps.event.addListener(marker, 'click', (something) => {
        this.infoWindow.setContent(`<p><strong>Creation date:</strong> ${marker.getTitle()}</p><ul><li><strong>Latitude:</strong> ${marker.getPosition().lat()}</li><li> <strong>Longitude:</strong> ${marker.getPosition().lng()}</li></ul>`);
        this.infoWindow.open(this.vectorMap, marker);
      }));  
    });
  }

  removeMarkersAndListeners(): void{
    this.listeners.markers.forEach((listener) => listener.remove());
    this.googleMarkers.forEach(marker => {
      marker.setMap(null);    
    });
  }

}
