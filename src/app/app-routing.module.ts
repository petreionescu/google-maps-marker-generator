import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/components/map.component';



const routes: Routes = [
  {
    path: '', component: MapComponent,
    loadChildren: () => import('./map/map.module').then(module => module.MapModule)
  }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
