import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrackdraftComponent } from './crackdraft/crackdraft.component';
import { FormatChooserComponent } from './format-chooser/format-chooser.component';
import { SharedModule } from "app/shared/shared.module";
import { RouterModule } from "@angular/router";
import { DraftStatsComponent } from "./draft-stats/draft-stats.component";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'crack', component: FormatChooserComponent },
      { path: 'crack/:draftId', component: CrackdraftComponent },
      { path: 'stats/:draftId/:crackId', component: DraftStatsComponent },
      { path: 'stats/:draftId', component: DraftStatsComponent }
      
    ])
  ],
  declarations: [
    CrackdraftComponent, 
    FormatChooserComponent,
    DraftStatsComponent
  ]
})
export class CrackModule { }
