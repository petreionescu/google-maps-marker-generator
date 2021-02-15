import { Component } from '@angular/core';
import { DataGeneratorService } from 'src/app/shared/services/data-generator.service';
import { ExtentObj } from 'src/app/shared/shared-map/types/extent-object.interface';
import { Marker } from 'src/app/shared/shared-map/types/marker.interface';
import { MemoryAllocation } from 'src/app/shared/shared-map/types/memory-allocation.interface';
import { RenderTime } from 'src/app/shared/shared-map/types/render-time.interface';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  public markers: Marker[] = null;
  public renderTime: RenderTime = {start: null, end: null}; 
  public showSpinner: boolean = false;
  public memmoryAllocation: MemoryAllocation;
  constructor(
    public dataGeneratorService: DataGeneratorService
  ) { }

  onDrawRectangleComplete(event: ExtentObj): void {
    this.showSpinner = true;
    this.renderTime.start = new Date();
    this.memmoryAllocation = window.performance['memory'];
    this.dataGeneratorService.generateMarkersBasedOnExtent(event).pipe(take(1)).subscribe((res) => {
      this.markers = res;
    });
  }

  onMarkerRenderComplete(event: boolean): void {
    if(!event){
      return;
    }
    if(window.performance['memory']){
      this.memmoryAllocation = {
        totalJSHeapSize: window.performance['memory'].totalJSHeapSize - this.memmoryAllocation.totalJSHeapSize,
        usedJSHeapSize: window.performance['memory'].usedJSHeapSize - this.memmoryAllocation.usedJSHeapSize,
        jsHeapSizeLimit: window.performance['memory'].jsHeapSizeLimit - this.memmoryAllocation.jsHeapSizeLimit
      };  
    }
    this.renderTime.end = new Date();
    this.renderTime.difference = this.getDifferenceBetweenTwoDates(this.renderTime);
    this.showSpinner = false;
  }

  getDifferenceBetweenTwoDates(renderTime: RenderTime): {seconds: number, minutes: number, hours: number}{
    let difference = Math.abs(renderTime.start.getTime() - renderTime.end.getTime());
    
    return {
      seconds: difference / 1000,
      minutes: difference / 1000 / 60,
      hours: difference / 10000 / 60 / 60
    };
  }
}
