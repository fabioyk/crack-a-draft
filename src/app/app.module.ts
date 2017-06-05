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
import { DraftSearchModule } from "app/draft-search/draft-search.module";

import { AlertModule, BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { AboutComponent } from './about/about.component';
import { DonateComponent } from './donate/donate.component';
import { DraftInfoModule } from "app/draft-info/draft-info.module";
import {Ng2SimplePageScrollModule} from 'ng2-simple-page-scroll/ng2-simple-page-scroll';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    DonateComponent    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DraftModule,
    CrackModule,
    DraftSearchModule,
    DraftInfoModule,
    Ng2SimplePageScrollModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: HomeComponent},
      { path: 'donate', component: DonateComponent}
    ]),
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [ Uploader ],
  bootstrap: [AppComponent]
})
export class AppModule { }
