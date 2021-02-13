import { Component, OnInit } from '@angular/core';
import { DataGeneratorService, Marker } from 'src/app/shared/services/data-generator.service';
import { ExtentObj } from 'src/app/shared/shared-map/types/extent-object.interface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  public markers: Marker[] = [];
  constructor(
    public dataGeneratorService: DataGeneratorService
  ) { }

  ngOnInit(): void {
  }

  onDrawRectangleComplete(event: ExtentObj): void {
    this.markers = this.dataGeneratorService.generateMarkersBasedOnExtent(event);
  }

}
