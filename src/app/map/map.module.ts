import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MapComponent } from './components/map.component';
import { SharedMapModule } from '../shared/shared-map/shared-map.module';





@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    SharedMapModule
  ],
  providers: [
    DatePipe
  ]
})
export class MapModule { }
