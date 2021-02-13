import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './components/map.component';
import { SharedMapModule } from '../shared/shared-map/shared-map.module';





@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    SharedMapModule
  ]
})
export class MapModule { }
