import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FaceRecoAdminComponent } from './face-reco-admin/face-reco-admin.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaceRecoComponent } from './face-reco/face-reco.component';




@NgModule({
  declarations: [
    AppComponent,
    FaceRecoAdminComponent,
    HomeComponent,
    FaceRecoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
