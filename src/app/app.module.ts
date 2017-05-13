import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DraftModule } from "app/draft/draft.module";

import { Uploader }      from 'angular2-http-file-upload';
import { CrackModule } from "app/crack/crack.module";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DraftModule,
    CrackModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent}
    ])
  ],
  providers: [ Uploader ],
  bootstrap: [AppComponent]
})
export class AppModule { }
