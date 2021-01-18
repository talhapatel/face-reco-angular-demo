import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FaceRecoAdminComponent } from './face-reco-admin/face-reco-admin.component';
import { FaceRecoComponent } from './face-reco/face-reco.component';

const routes: Routes = [

  { path: '', component: FaceRecoAdminComponent },
  /*   { path: 'face-recognition', component: FaceRecoComponent } */

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
