import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraftInfoComponent } from './draft-info/draft-info.component';
import { DraftPicksComponent } from './draft-picks/draft-picks.component';
import { DraftPoolComponent } from "./draft-pool/draft-pool.component";
import { PickRateComponent } from './pick-rate/pick-rate.component';
import { StatsComponent } from './stats/stats.component';
import { FirstPicksComponent } from './first-picks/first-picks.component';
import { SharedModule } from "app/shared/shared.module";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { AlertModule, TabsModule, AccordionModule, ButtonsModule, TooltipModule } from "ngx-bootstrap";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'draft/:draftId/:crackId', component: DraftInfoComponent},
      { path: 'draft/:draftId', component: DraftInfoComponent }
      
    ]),
    AlertModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    ButtonsModule.forRoot(),
    TooltipModule.forRoot(),
    BrowserModule, BrowserAnimationsModule, NgxChartsModule
  ],
  declarations: [
    DraftInfoComponent, 
    DraftPicksComponent, 
    PickRateComponent, 
    StatsComponent, 
    FirstPicksComponent,
    DraftPoolComponent
  ]
})
export class DraftInfoModule { }
