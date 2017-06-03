import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrackdraftComponent } from './crackdraft/crackdraft.component';
import { FormatChooserComponent } from './format-chooser/format-chooser.component';
import { SharedModule } from "app/shared/shared.module";
import { RouterModule } from "@angular/router";
import { AlertModule, TabsModule, AccordionModule, ButtonsModule, TooltipModule } from "ngx-bootstrap";
import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { FormsModule } from "@angular/forms";
import { DraftModule } from "app/draft/draft.module";


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    DraftModule,
    RouterModule.forChild([
      { path: 'crack/:draftId', component: CrackdraftComponent }      
    ]),
    AlertModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    ButtonsModule.forRoot(),
    TooltipModule.forRoot(),
    BrowserModule, BrowserAnimationsModule, NgxChartsModule
  ],
  declarations: [
    CrackdraftComponent, 
    FormatChooserComponent
  ],
  exports: [
    FormatChooserComponent
  ]
})
export class CrackModule { }
