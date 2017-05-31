import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrackdraftComponent } from './crackdraft/crackdraft.component';
import { FormatChooserComponent } from './format-chooser/format-chooser.component';
import { SharedModule } from "app/shared/shared.module";
import { RouterModule } from "@angular/router";
import { DraftStatsComponent } from "./draft-stats/draft-stats.component";
import { AlertModule, TabsModule, AccordionModule, ButtonsModule } from "ngx-bootstrap";
import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { FormsModule } from "@angular/forms";


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'crack', component: FormatChooserComponent },
      { path: 'crack/:draftId', component: CrackdraftComponent },
      { path: 'stats/:draftId/:crackId', component: DraftStatsComponent },
      { path: 'stats/:draftId', component: DraftStatsComponent }
      
    ]),
    AlertModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    ButtonsModule.forRoot(),
    BrowserModule, BrowserAnimationsModule, NgxChartsModule
  ],
  declarations: [
    CrackdraftComponent, 
    FormatChooserComponent,
    DraftStatsComponent
  ],
  exports: [
    FormatChooserComponent
  ]
})
export class CrackModule { }
